import json
import boto3
import requests

# Function to get the API key from AWS Systems Manager (SSM)
def get_api_key():
    # Create an SSM client
    ssm = boto3.client('ssm', region_name='us-east-1')

    # Retrieve the parameter (API key)
    response = ssm.get_parameter(
        Name='/myapp/api_key',  # Name of the stored API key
        WithDecryption=True
    )

    # Extract the API key value from the response
    api_key = response['Parameter']['Value']
    return api_key

# Function to call the Hello API
def call_hello_function(api_key):
    # URL of the Hello API
    api_url = 'https://8n3b6jkgz7.execute-api.us-east-1.amazonaws.com/Prod/hello/'

    # Headers with the API key
    headers = {
        'x-api-key': api_key
    }

    # Make the GET request to the Hello API
    response = requests.get(api_url, headers=headers)

    # Check if the request was successful
    if response.status_code == 200:
        return response.json()
    else:
        # Raise an error if the request failed
        response.raise_for_status()

# Goodbye Lambda function
def lambda_handler(event, context):
    try:
        # Retrieve the API key
        api_key = get_api_key()

        # Call the Hello API using the API key
        hello_response = call_hello_function(api_key)

        # Return the Goodbye message along with the Hello response
        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "goodbye world",
                "hello_response": hello_response  # Include the hello response in the goodbye response
            }),
        }

    except Exception as e:
        # Handle any errors that occur
        return {
            "statusCode": 500,
            "body": json.dumps({
                "error": str(e)
            }),
        }
