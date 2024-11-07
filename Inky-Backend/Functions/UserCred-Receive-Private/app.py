import json

def lambda_handler(event, context):
    # The event contains the payload sent from the public function
    try:
        username = event.get('username')
        password = event.get('password')

        # Check if username and password are present
        if not username or not password:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Username and password are required.'})
            }

        # Process the credentials (for demonstration, we'll just return them)
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Credentials received.',
                'username': username,
                'password': password
            })
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': f'An error occurred: {str(e)}'})
        }
