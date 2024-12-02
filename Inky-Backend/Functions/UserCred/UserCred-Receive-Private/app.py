# usercredprivate.py

import json
import pymysql
import os
import boto3
import logging
import time

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
            'body': json.dumps({'error': 'Email and password are required.'})
        }

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
            'body': json.dumps({'error': 'Error retrieving database credentials.', 'message': str(e)})
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
            'body': json.dumps({'error': 'Database connection failed.', 'message': str(e)})
        }

    # Insert new user into the UserCred table without hashing the password
    try:
        db_insert_start_time = time.time()
        with connection.cursor() as cursor:
            # Check if email already exists to enforce uniqueness
            check_sql = "SELECT COUNT(*) FROM UserCred WHERE email = %s"
            cursor.execute(check_sql, (email,))
            count = cursor.fetchone()[0]
            if count > 0:
                logger.warning("Attempt to register with existing email: %s", email)
                return {
                    'statusCode': 409,  # Conflict
                    'body': json.dumps({'error': 'Email already registered.'})
                }

            # Insert into UserCred
            sql = "INSERT INTO UserCred (email, password) VALUES (%s, %s)"
            cursor.execute(sql, (email, password))
            user_id = cursor.lastrowid  # Get the new user_id from UserCred

            # Insert into UserInformation with the same user_id
            sql_info = "INSERT INTO UserInformation (user_id) VALUES (%s)"
            cursor.execute(sql_info, (user_id,))
            
            connection.commit()  # Commit both insertions
            logger.info("User and UserInformation inserted with user_id: %s. Time taken: %s seconds", user_id, time.time() - db_insert_start_time)
    except Exception as e:
        logger.error("Failed to insert user: %s", str(e))
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to insert user.', 'message': str(e)})
        }
    finally:
        connection.close()
        logger.info("Database connection closed.")

    # Log the total execution time
    logger.info("Lambda execution completed in %s seconds", time.time() - start_time)

    # Return success response
    return {
        'statusCode': 201,  # Created
        'body': json.dumps({'message': 'User created successfully.', 'user_id': user_id})
    }
