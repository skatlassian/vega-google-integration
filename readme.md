## installations
While setting the project for first time, run these comamnds from root of the project to install the node modules required
```node
npm install googleapis
npm install @googleapis/docs
npm install properties-reader
npm install axios
```

## Setting terminal
Run the below command from terminal for your local set up

```node
# install atlas cli from https://developer.atlassian.com/platform/atlas-cli/users/install/
/bin/bash -c "$(curl -fsSL https://statlas.prod.atl-paas.net/atlas-cli/install.sh)"

install SLAuth CLI https://developer.atlassian.com/platform/slauth/cli/install/
# atlas plugin install -n slauth 
```

## Creating sensitive files
The below files are not added to git as they contain sensitive information. They have to be created and refreshed with actual values for every developer

```node
# create a properties file named 'env.properties' in the root directory

# create/put the 'my-google-svc-account.json' inside the google sub directory to store the google auth json
```


## Setting up the properties file
```node
# set below variables (replace with actual values) into the properties file created above
GOOGLE_SHEET_ID=SHEET_ID
GOOGLE_SHEET_NAME=SHEET_NAME
GOOGLE_SHEET_UPDATE_NAME=SHEET_UPDATE_NAME
GCLOUD_PROJECT=PROJECT_ID
GOOGLE_APPLICATION_CREDENTIALS=./my-google-svc-account.json
```

## Doc used to integrate with google sheet
```node
# https://hackernoon.com/how-to-use-google-sheets-api-with-nodejs-cz3v316f
```

## Developers/Contributors
```node
Anupam Singh Deo
Sandip Shrivastava
```
## License
[JIRA EMEA Team](www.atlassian.com)