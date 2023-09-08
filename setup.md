# While setting the project for first time, run these comamnds from root of the project
npm install googleapis
npm install @googleapis/docs
npm install properties-reader
npm install axios


# install atlas cli from https://developer.atlassian.com/platform/atlas-cli/users/install/
# /bin/bash -c "$(curl -fsSL https://statlas.prod.atl-paas.net/atlas-cli/install.sh)"

# install SLAuth CLI https://developer.atlassian.com/platform/slauth/cli/install/
# atlas plugin install -n slauth 

# create a properties file named 'env.properties' and set below variables
GOOGLE_SHEET_ID=SHEET_ID
GOOGLE_SHEET_NAME=SHEET_NAME
GOOGLE_SHEET_UPDATE_NAME=SHEET_UPDATE_NAME
GCLOUD_PROJECT=PROJECT_ID
# the my-google-svc-account.json is present in google directory
GOOGLE_APPLICATION_CREDENTIALS=./my-google-svc-account.json


# Doc used to integrate with google sheet
# https://hackernoon.com/how-to-use-google-sheets-api-with-nodejs-cz3v316f