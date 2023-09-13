## Creating sensitive files
The below files are not added to git as they contain sensitive information. They have to be created and refreshed with actual values for every developer

```node
# create a properties file named 'env.properties' in the root directory
```

## Setting up the properties file
```node
# set below variables (replace with actual values) into the properties file created above. Keep the GOOGLE_APPLICATION_CREDENTIALS and VEGA_URL values as it is.
GOOGLE_SHEET_ID=SHEET_ID
GOOGLE_SHEET_NAME=SHEET_NAME
GOOGLE_SHEET_UPDATE_NAME=SHEET_UPDATE_NAME
GCLOUD_PROJECT=PROJECT_ID
GOOGLE_APPLICATION_CREDENTIALS=./my-google-svc-account.json
VEGA_URL=https://vega.us-east-1.prod.atl-paas.net/graphql
# Configure Manager Mapping (this is subject to change, as of now we are fetching reportees of these two managers and update events)
MANAGERS_LIST=vkgan, alonare
```




## Installations
While setting the project for first time, run these comamnds from root of the project to install the node modules required
```node
npm install googleapis
npm install @googleapis/docs
npm install properties-reader
npm install axios
```

## Setting terminal
Run the below command from terminal for your local set up. 
These packages are required to create vega tokens which is used to authenticate with vega.

```node
# install atlas cli from https://developer.atlassian.com/platform/atlas-cli/users/install/
/bin/bash -c "$(curl -fsSL https://statlas.prod.atl-paas.net/atlas-cli/install.sh)"

# install SLAuth CLI https://developer.atlassian.com/platform/slauth/cli/install/
atlas plugin install -n slauth 
```

## Steps used to integrate with google sheet
```node
Currently, we don't have permission to create project in our atlassian's gmail box. The below steps are from my personal gmail ID.
* Open google developer console
* Create a project; give a name and choose a location
* Go to https://console.developers.google.com/ again
* Click on 'ENABLE APIS AND SERVICES'
* Click on 'Google Sheets API', enable it
* Create a service account from google developer console; give a name, id and email address
* Once done, click on the three dots to the right of service account and navigate to 'Manage keys'
* Click on Create new key, choose JSON format, download it and rename it to 'my-google-svc-account.json'
* Move this key to the project inside the google folder
* You will see an email created for the service account, copy that and share that with the sheet you want to interact through script
* Identify the id of the sheet (observe the URL after '/spreadsheets/d/' till '/edit' starts), save it as 'GOOGLE_SHEET_ID' in properties file
* Save the sheet name as 'GOOGLE_SHEET_NAME' in properties file, this is the sheet used to read data from
* Save the sheet name as 'GOOGLE_SHEET_UPDATE_NAME' in properties file, this is the sheet used to update data from
```



## Project links
![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white) <br>
[Join us](https://atlassian.slack.com/archives/C05Q71R0P6) <br> <br>

![Jira](https://img.shields.io/badge/jira-%230A0FFF.svg?style=for-the-badge&logo=jira&logoColor=white)<br>
[Visit us](https://shipit.atlassian.net/browse/SHPLVII-71)


## Github URL
[vega-google-integration](https://github.com/adeo-atlassian/vega-google-integration)

## Developers/Contributors
[Anupam Singh Deo](https://directory.prod.atl-paas.net/employees/adeo) <br />
[Sandip Shrivastava](https://directory.prod.atl-paas.net/employees/sshrivastava)



## License
[JIRA EMEA Team](www.atlassian.com)

## Schema
[Schema](https://studio.apollographql.com/graph/Vega-Calendar/variant/prod/schema/reference)

## GraphQL Servers
[Prod](https://vega.prod.atl-paas.net/graphql) <br />
[Dev](https://vega.dev.atl-paas.net/graphql) <br />
[Stage](https://vega.staging.atl-paas.net/graphql) <br />