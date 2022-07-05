const awsvideoconfig = {
    "awsInputVideo": "vod-input-bucket02029c894ee8",
    "awsOutputVideo": "vod-output-bucket02029c894ee8",

    "aws_project_region": "us-east-2",
    "aws_cognito_identity_pool_id": "us-east-2:dca1326b-67e8-472f-a686-8546f13c514e",
    "aws_user_pools_id": "us-east-2_aB0xajQ52",
    "aws_user_pools_web_client_id": "5fqjvi7j45qkggs1lecn3ur5qu",
    "aws_cognito_region": "us-east-2",
    "oauth": {},
    "aws_cognito_username_attributes": [],
    "aws_cognito_social_providers": [],
    "aws_cognito_signup_attributes": [
        "EMAIL"
    ],
    "aws_cognito_mfa_configuration": "OFF",
    "aws_cognito_mfa_types": [
        "SMS"
    ],
    "aws_cognito_password_protection_settings": {
        "passwordPolicyMinLength": 8,
        "passwordPolicyCharacters": []
    },
    "aws_cognito_verification_mechanisms": [
        "EMAIL"
    ],
    "aws_appsync_graphqlEndpoint": "https://cgjb6hsezzbnxi3skvmddkmjyy.appsync-api.us-east-2.amazonaws.com/graphql",
    "aws_appsync_region": "us-east-2",
    "aws_appsync_authenticationType": "AMAZON_COGNITO_USER_POOLS"
};

export default awsvideoconfig;
