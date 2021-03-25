#!/bin/bash

# This directory is where you have all your results locally, generally named as `allure-results`
ALLURE_RESULTS_DIRECTORY='allure-results'
# This url is where the Allure container is deployed. We are using localhost as example
ALLURE_SERVER='https://allure.dev.digdir.no'
# Project ID according to existent projects in your Allure container - Check endpoint for project creation >> `[POST]/projects`
PROJECT_ID='c2id'
#PROJECT_ID='my-project-id'
# Set SECURITY_USER & SECURITY_PASS according to Allure container configuration
SECURITY_USER='my_username'
SECURITY_PASS='V8K*!xSS25h5yH'

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
#FILES_TO_SEND=$(ls -dp $DIR/$ALLURE_RESULTS_DIRECTORY/* | grep -v /$)
FILES_TO_SEND=find $DIR/$ALLURE_RESULTS_DIRECTORY/ -type f -name ‘*’ | wc -l
if [ -z "$FILES_TO_SEND" ]; then
  exit 1
fi

FILES=''
for FILE in $FILES_TO_SEND; do
  FILES+="-F files[]=@$FILE "
done

set -o xtrace
echo "------------------LOGIN-----------------"
curl -X POST "$ALLURE_SERVER/allure-api/send-results?project_id=$PROJECT_ID" -H 'Content-Type: multipart/form-data' $FILES -ik

curl -X POST "$ALLURE_SERVER/allure-api/login" \
  -H 'Content-Type: application/json' \
  -d "{
    "\""username"\"": "\""$SECURITY_USER"\"",
    "\""password"\"": "\""$SECURITY_PASS"\""
}" -c cookiesFile -ik

echo "------------------EXTRACTING-CSRF-ACCESS-TOKEN------------------"
CRSF_ACCESS_TOKEN_VALUE=$(cat cookiesFile | grep -o 'csrf_access_token.*' | cut -f2)
echo "csrf_access_token value: $CRSF_ACCESS_TOKEN_VALUE"

echo "------------------SEND-RESULTS------------------"
curl -X POST "$ALLURE_SERVER/allure-api/send-results?project_id=$PROJECT_ID" \
  -H 'Content-Type: multipart/form-data' \
  -H "X-CSRF-TOKEN: $CRSF_ACCESS_TOKEN_VALUE" \
  -b cookiesFile $FILES -ik


#generate reports on demand use the endpoint `GET /generate-report` and disable the Automatic Execution >> `CHECK_RESULTS_EVERY_SECONDS: NONE`
echo "------------------GENERATE-REPORT------------------"


#uploaded test results with simple curl
curl -X GET "$ALLURE_SERVER/allure-api/generate-report?project_id=$PROJECT_ID" \
  -H 'Content-Type: multipart/form-data' \
  -H "X-CSRF-TOKEN: $CRSF_ACCESS_TOKEN_VALUE" \
  -b cookiesFile $FILES -ik


