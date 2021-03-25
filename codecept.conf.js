require('dotenv').config({path: (process.env.CODECEPT_ARGS && 'env')});

const {setSharedCookies} = require('@codeceptjs/configure');
setSharedCookies(); // share cookies between browser helpers and REST helper

exports.config = {
  tests: './src/tests/*_test.js',
  output: './output',
  timeout: 20000,
  helpers: {
    Puppeteer: {
      url: process.env.IDPORTEN_HOST,
      waitForNavigation: ["networkidle0", "domcontentloaded"],
      // waitForNavigation:  "networkidle0",
      waitForAction: 100,
      waitForTimeout: 20000,
      getPageTimeout: 20000,
      windowSize: "1200x900",
      show: false,
      chrome: {
        args: ['--disable-features=IsolateOrigins,site-per-process', '--disable-site-per-process', '--disable-web-security', '--no-sandbox'],
        ignoreHTTPSErrors: true
      },
      pressKeyDelay: 5
    },
     REST: {
       endpoint: process.env.TOKEN_ENDPOINT,
       },
    AssertWrapper: {
      require: "codeceptjs-assert"
    },
    BankIdHelper: {
      require: './src/helpers/bankid_helper.js',
    },
    Mochawesome: {
      uniqueScreenshotNames: true,
      disableScreenshots: false
    },
  },

  include: {
    I: './src/steps/steps_file.js',
    oidcClientPage: './src/pages/oidcClientPage.js',
  },


  bootstrap: null,

  mocha: {
    reporterOptions: {
      'mocha-junit-reporter': {
        stdout: '-',
        options: {
          mochaFile: './output/results.xml',
          testsuitesTitle: 'ID-porten tests',
          attachments: true,
          jenkinsMode: true
        },
        attachments: true //add screenshot for a failed test
      },
      'codeceptjs-cli-reporter': {
        stdout: './output/console.log',
        options: {
          verbose: false,
          steps: true,
        },
      },
      'mochawesome': {
        stdout: '-',
        options: {
          reportDir: './output',
          reportFilename: 'results',
          json: false,
          inline: true
        },
      }
    },
  },


  name: 'tests-codeceptjs',

    plugins: {
        allure: {
                  outputDir: "./idporten-tests/allure-results"
                 },
        pauseOnFail: {},
        retryFailedStep: {
            enabled: true
        },
        tryTo: {
            enabled: true
        },
        screenshotOnFail: {
            enabled: true
        }
    }
};