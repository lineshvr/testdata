# idporten-tests
ConceptJS tests for regressiontests and other systemtests for ID-porten.
#installation
latest Nodejs
npm install --global yarn
yarn install
# Run Tests
 npx codeceptjs run --steps --verbose
#run test with allure report 
npx codeceptjs run --steps --plugins allure
#run test with multiple reports
 npx codeceptjs run --steps --reporter multi:mocha

# while running test to show GUI ->  need to change     
# show: false to show: true 
#in codecept.conf.js file in puppeteer config.
