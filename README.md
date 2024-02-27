# Gallivant

Gallivant guides you to be a better tourist!

# Basic Instructions for End User

# Starting the app for local development

Fork and clone down the repo from: 

### Install dependencies

> npm install

### Set up database connection

You will need MySQL 

### Compile with webpack

> npm run build

### Start express server 

> npm run start

# Environment Variables

See env.example for .env file structure. Create a .env file and copy the contents of the example file.  .env should already be listed in the .gitignore. Check to make sure.

You will need to set up

Google Authentication: You'll need to set up a project in Google Cloud Platform and configure the Client ID and Secret in the API's & Services section.

AWS s3 bucket storage: You will need an AWS account for bucket storage (as well as deployment). 

# s3 Cloud Storage

You will need to set up cloud storage for image hosting. Using your AWS account that you set up for deployment, set up an s3 bucket:

1. Navigate to aws.com and sign in to the console.

2. Navigate to the s3 bucket console.

3. Click the orange Create Bucket button.

4. Select a bucket name (must be unique) and set your region if it's not already selected. Leave all the default setting as is, and click the Create Bucket button at the bottom of the page.

5. Click on the bucket name where you see it under General Purpose Buckets. Copy the bucket name and add it to your .env for AWS_BUCKET_NAME. Copy the bucket region as well (i.e 'us-east-2) and assign that to AWS_BUCKET_REGION.

6. This bucket is private, so you will need to create an IAM Policy for your bucket in order to render images stored in your bucket on your application instance. Navigate to the IAM console.

7. Click on 'Policies' under Access Management, then click Create New Policy. In Services, choose s3. In Actions, click on the Write dropdown under Access Level, and select both DeleteObject and PutObject. In the Read dropdown, select GetObject.

8. Under Resources, select 'Specific' and click on 'Add ARN.' Add the name of your bucket for 'Bucket Name *', and select 'Any' for 'Object Name *'. Click Next until you get to Reviews.

9. Add a name for your policy and click 'Create Policy.'

10. You will need to assign this policy to a User, so click on Users under Access Management. Click 'Add User'. Set a user name under 'Set User Details,' then select 'Programmatic Access' for Access Type.

11. Next, go to Set Permissions, and click 'Attach Existing Policies Directly,' Search for the policy you just created, click the check box, and click Next. Click through until you get to Review, the click on 'Create the User.' This will bring you to a Success page which will give you your Access Key Id and Secret Access Key, copy them and add them to your .env in the appropriate places. And you're done!






