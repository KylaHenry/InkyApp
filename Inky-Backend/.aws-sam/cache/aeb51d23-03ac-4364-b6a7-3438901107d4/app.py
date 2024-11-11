import json
import pymysql
import os
import boto3
import bcrypt
import logging

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
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

    # Hash the password
    try:
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        hashed_password_str = hashed_password.decode('utf-8')
        logger.info("Password hashed successfully.")
    except Exception as e:
        logger.error("Error hashing password: %s", str(e))
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Error hashing password.', 'message': str(e)})
        }

    # Retrieve database credentials from AWS Secrets Manager
    secret_name = os.environ['DB_SECRET_NAME']
    region_name = os.environ['AWS_REGION']
    logger.info("Retrieving database credentials from Secrets Manager.")

    # Create a Secrets Manager client
    session = boto3.session.Session()
    secrets_client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    try:
        secret_value = secrets_client.get_secret_value(SecretId=secret_name)
        db_credentials = json.loads(secret_value['SecretString'])
        logger.info("Database credentials retrieved successfully.")
    except Exception as e:
        logger.error("Error retrieving database credentials: %s", str(e))
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Error retrieving database credentials.', 'message': str(e)})
        }

    # Database connection parameters
    db_host = db_credentials['host']
    db_username = db_credentials['username']
    db_password = db_credentials['password']
    db_name = db_credentials['dbname']
    db_port = int(db_credentials.get('port', 3306))

    # Connect to the RDS database
    try:
        connection = pymysql.connect(
            host=db_host,
            user=db_username,
            password=db_password,
            database=db_name,
            port=db_port,
            connect_timeout=5
        )
        logger.info("Connected to the database successfully.")
    except pymysql.MySQLError as e:
        logger.error("Database connection failed: %s", str(e))
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Database connection failed.', 'message': str(e)})
        }

    # Insert new user into the UserCred table
    try:
        with connection.cursor() as cursor:
            sql = "INSERT INTO UserCred (email, password) VALUES (%s, %s)"
            cursor.execute(sql, (email, hashed_password_str))
            connection.commit()
            user_id = cursor.lastrowid
            logger.info("User inserted with user_id: %s", user_id)
    except Exception as e:
        logger.error("Failed to insert user: %s", str(e))
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to insert user.', 'message': str(e)})
        }
    finally:
        connection.close()
        logger.info("Database connection closed.")

    # Return success response
    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'User created successfully.', 'user_id': user_id})
    }
