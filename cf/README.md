# CloudFormation Deployment

## Create an S3 bucket (e.g. serverless-vod-dev-deployment)

## copy files from this cf directory to your bucket (e.g. aws s3 sync . s3://serverless-vod-dev-deployment)

## get the URL for the root stack in the S3 bucket after uploading (e.g. https://serverless-vod-dev-deployment.s3.ca-central-1.amazonaws.com/root-cloudformation-stack.json)

## go to the CloudFormation console and create a stack use the following parameters

#### stack name - serverless-vodm-dev-mystack-deployment <- MUST HAVE 4 DASHES
#### AuthRoleName - keep default vodAuthRoleName
#### UnauthRoleName - keep default vodUnAuthRoleName
#### DeploymentBucketName - this must be the S3 bucket name created in first step

# once stack is complete

## update aws-video-exports.js with parameters created in the stack

## "awsInputVideo":  "vod-input-bucket-0e87d482a954",
## "awsOutputVideo": "vod-output-bucket-0e87d482a954"
## "aws_project_region": "ca-central-1",
## "aws_cognito_identity_pool_id": "ca-central-1:c4507cee-066b-4dfd-9c68-8e863e9a9052",
## "aws_cognito_region": "ca-central-1",
## "aws_user_pools_id": "ca-central-1_ZcuFOcqZz",
## "aws_user_pools_web_client_id": "2evogn66uduj11ibg339jr5sib",
## "aws_appsync_graphqlEndpoint": "https://7b2wbp37wrejhn3ctycwac3mcy.appsync-api.ca-central-1.amazonaws.com/graphql",

## run locally (npm install ; npm start)

## host on Amplify
