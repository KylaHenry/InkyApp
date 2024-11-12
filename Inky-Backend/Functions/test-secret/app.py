import boto3
import pymysql
import os
import json

def lambda_handler(event, context):
    print("Lambda function has started.")

    # Initialize SSM client
    ssm = boto3.client('ssm')

    # Retrieve parameters
    try:
        print("Attempting to retrieve database username from SSM Parameter Store...")
        username_param = ssm.get_parameter(
            Name='/database/username',
            WithDecryption=True
        )
        print("Username retrieved successfully.")

        print("Attempting to retrieve database password from SSM Parameter Store...")
        password_param = ssm.get_parameter(
            Name='/database/password',
            WithDecryption=True
        )
        print("Password retrieved successfully.")
    except Exception as e:
        print(f"Error retrieving parameters: {e}")
        raise e

    username = username_param['Parameter']['Value']
    password = password_param['Parameter']['Value']

    # Database connection details
    host = os.environ.get('DB_HOST', 'inky-database.cxgmeo0oo52y.us-east-1.rds.amazonaws.com')
    port = int(os.environ.get('DB_PORT', 3306))
    database = os.environ.get('DB_NAME', 'inky-database')

    # Connect to the database
    try:
        print("Attempting to connect to the database...")
        connection = pymysql.connect(
            host=host,
            user=username,
            password=password,
            database=database,
            port=port,
            connect_timeout=5
        )
        print("Database connection established.")
    except Exception as e:
        print(f"Error connecting to the database: {e}")
        raise e

    # Perform a simple query
    try:
        print("Executing test query...")
        with connection.cursor() as cursor:
            cursor.execute("SELECT NOW();")
            result = cursor.fetchone()
            print(f"Query result: {result}")
    except Exception as e:
        print(f"Error executing query: {e}")
        raise e
    finally:
        connection.close()
        print("Database connection closed.")

    print("Lambda function completed successfully.")
    return {
        'statusCode': 200,
        'body': json.dumps('Successfully connected to the database and executed a query.')
    }
