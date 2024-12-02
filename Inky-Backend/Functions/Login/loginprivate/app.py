# loginprivate.py

import json
import pymysql
import os
import boto3
import logging
import time
import jwt  # Ensure PyJWT is installed

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    start_time = time.time()
    logger.info("Received event: %s", json.dumps(event))

    # Extract credentials from the event
    email = event.get('email')
    password = event.get('password')

    if not email or not password:
        logger.error("Email or password not provided.")
        return {
            'statusCode': 400,
            'body': {'error': 'Email and password are required.'}
        }

    # Retrieve JWT secret from environment variable
    JWT_SECRET = os.environ.get('JWT_SECRET', 'your-default-secret-key')
    JWT_ALGORITHM = 'HS256'

    # Retrieve database credentials from Parameter Store
    parameter_name = os.environ['DB_PARAMETER_NAME']
    logger.info("Retrieving database credentials from Parameter Store.")

    # Create an SSM client
    parameter_retrieval_start_time = time.time()
    ssm_client = boto3.client('ssm')

    try:
        parameter = ssm_client.get_parameter(Name=parameter_name, WithDecryption=True)
        db_credentials = json.loads(parameter['Parameter']['Value'])
        logger.info("Database credentials retrieved successfully. Time taken: %s seconds", time.time() - parameter_retrieval_start_time)

    except Exception as e:
        logger.error("Error retrieving database credentials: %s", str(e))
        return {
            'statusCode': 500,
            'body': {'error': 'Error retrieving database credentials.', 'message': str(e)}
        }

    # Database connection parameters
    db_host = db_credentials['host']
    db_username = db_credentials['username']
    db_password_db = db_credentials['password']  # Renamed to avoid conflict with user password
    db_name = db_credentials['dbname']
    db_port = int(db_credentials.get('port', 3306))

    # Connect to the RDS database
    try:
        db_connection_start_time = time.time()
        connection = pymysql.connect(
            host=db_host,
            user=db_username,
            password=db_password_db,
            database=db_name,
            port=db_port,
            connect_timeout=5
        )
        logger.info("Connected to the database successfully. Time taken: %s seconds", time.time() - db_connection_start_time)

    except pymysql.MySQLError as e:
        logger.error("Database connection failed: %s", str(e))
        return {
            'statusCode': 500,
            'body': {'error': 'Database connection failed.', 'message': str(e)}
        }

    # Authenticate user by directly comparing passwords
    try:
        auth_start_time = time.time()
        with connection.cursor() as cursor:
            # Retrieve the stored password from the database
            sql = "SELECT user_id, password FROM UserCred WHERE email = %s"
            cursor.execute(sql, (email,))
            result = cursor.fetchone()

            if result:
                user_id, stored_password = result
                logger.info("User found with user_id: %s", user_id)

                # Directly compare the input password with the stored password
                if password == stored_password:
                    logger.info("Password verification successful. Time taken: %s seconds", time.time() - auth_start_time)
                    # Generate JWT token
                    token_payload = {
                        'user_id': user_id,
                        'email': email,
                        'exp': int(time.time()) + 3600  # Token expires in 1 hour
                    }
                    token = jwt.encode(token_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

                    return {
                        'statusCode': 200,
                        'body': {
                            'message': 'Login successful.',
                            'user_id': user_id,
                            'token': token
                        }
                    }
                else:
                    logger.info("Password verification failed for user_id: %s. Time taken: %s seconds", user_id, time.time() - auth_start_time)
                    # Return unauthorized response
                    return {
                        'statusCode': 401,
                        'body': {'error': 'Invalid email or password.'}
                    }
            else:
                logger.info("User not found with email: %s. Time taken: %s seconds", email, time.time() - auth_start_time)
                # Return unauthorized response
                return {
                    'statusCode': 401,
                    'body': {'error': 'Invalid email or password.'}
                }
    except Exception as e:
        logger.error("Error during authentication: %s", str(e))
        return {
            'statusCode': 500,
            'body': {'error': 'Authentication failed.', 'message': str(e)}
        }
    finally:
        connection.close()
        logger.info("Database connection closed.")

    # Log the total execution time
    logger.info("Lambda execution completed in %s seconds", time.time() - start_time)

    # Should not reach here, but in case
    return {
        'statusCode': 500,
        'body': {'error': 'Unexpected error occurred.'}
    }
