# Public

import json
import boto3
import os

def lambda_handler(event, context):
    # Parse the request body to get username and password
    body = event.get('body')
    if body:
        try:
            data = json.loads(body)
            username = data.get('username')
            password = data.get('password')

            # Check if username and password are provided
            if not username or not password:
                return {
                    'statusCode': 400,
                    'body': json.dumps({'message': 'Username and password are required.'})
                }

            # Prepare the payload to send to the private function
            payload = {
                'username': username,
                'password': password
            }

            # Invoke the private function
            lambda_client = boto3.client('lambda')
            response = lambda_client.invoke(
                FunctionName=os.environ['PRIVATE_FUNCTION_ARN'],
                InvocationType='RequestResponse',  # Synchronous invocation
                Payload=json.dumps(payload)
            )

            # Get the response from the private function
            response_payload = json.loads(response['Payload'].read())

            # Return the response to the client
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': 'Credentials sent to private function.',
                    'privateFunctionResponse': response_payload
                })
            }

        except json.JSONDecodeError:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Invalid JSON in request body.'})
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'body': json.dumps({'message': f'An error occurred: {str(e)}'})
            }
    else:
        return {
            'statusCode': 400,
            'body': json.dumps({'message': 'No request body found.'})
        }
