import json
import boto3
import os
import logging

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    logger.info("Received event: %s", json.dumps(event))

    # Extract credentials from the API Gateway event
    try:
        body = json.loads(event['body'])
        email = body['email']
        password = body['password']
        logger.info("Extracted email and password from request!")
    except (KeyError, TypeError, json.JSONDecodeError) as e:
        logger.error("Error parsing input: %s", str(e))
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid input', 'message': str(e)})
        }

    # Prepare payload for the private function
    payload = {
        'email': email,
        'password': password
    }

    # Invoke the private function
    lambda_client = boto3.client('lambda')
    private_function_arn = os.environ['PRIVATE_FUNCTION_ARN']
    logger.info("Invoking private function with ARN: %s", private_function_arn)

    try:
        response = lambda_client.invoke(
            FunctionName=private_function_arn,
            InvocationType='RequestResponse',
            Payload=json.dumps(payload)
        )

        # Process the response from the private function
        response_payload = json.loads(response['Payload'].read())
        logger.info("Received response from private function: %s", response_payload)

        # Return the response to the client
        return {
            'statusCode': response_payload.get('statusCode', 200),
            'body': json.dumps(response_payload.get('body', {}))
        }
    except Exception as e:
        logger.error("Error invoking private function: %s", str(e))
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Internal server error', 'message': str(e)})
        }
