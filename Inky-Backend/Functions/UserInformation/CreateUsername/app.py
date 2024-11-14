import json
import pymysql
import os
import boto3
import logging
import time


def lambda_handler(event, context):
    username = event.get('username')
    user_id = event.get('user_id')

    if not username or not user_id:
        return 
        {
            'statusCode': 400,
            'body': json.dumps({'error': 'Username and user_id are required'})
        }

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
        return 
        {
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
        db_connection_start_time = time.time()
        connection = pymysql.connect(
            host=db_host,
            user=db_username,
            password=db_password,
            database=db_name,
            port=db_port,
            connect_timeout=5
        )
        logger.info("Connected to the database successfully. Time taken: %s seconds", time.time() - db_connection_start_time)

    except pymysql.MySQLError as e:
        logger.error("Database connection failed: %s", str(e))
        return 
        {
            'statusCode': 500,
            'body': json.dumps({'error': 'Database connection failed.', 'message': str(e)})
        }

    try:
        db_insert_start_time = time.time()
        with connection.cursor() as cursor:
            sql = "UPDATE UserInformation SET username = %s WHERE user_id = %s"
            cursor.execute(sql, (username, user_id))
            connection.commit()
    except Exception as e:
        logger.error("Failed to create username: %s", str(e))
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to create username.', 'message': str(e)})
        }
    finally:
        connection.close()
        logger.info("Database connection closed.")


    return 
    {
        'statusCode': 200,
        'body': f'Hello, {username} from CreateUsernameFunction!'
    }
