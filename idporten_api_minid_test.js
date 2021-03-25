Feature('IDPorten OIDC-Provider - innlogging nivå 3');
    var nonce, state,returnState;
    Before(({I}) => {
        nonce = I.getRandomStr();
        state = I.getRandomStr();
        console.log(nonce);
        console.log(state);
        var urlForAPi = process.env.REDIRECT_API_URI + '&client_id=' + process.env.CLIENT_ID  + '&nonce=' + nonce + '&state=' + state;
        console.log(urlForAPi);
        I.amOnPage(urlForAPi);

        I.seeInCurrentUrl('/idporten/authorize/selector');
        I.see("VELG ELEKTRONISK ID");
    });

    After(({I}) => {
        I.amOnPage(process.env.END_SESSION_ENDPOINT);
    });


Scenario('attempts login through via api', async ({I}) => {


    await I.loginWithMinID('Velg MinID','minid');

    let url = await I.grabCurrentUrl();
    I.getClaims(url);
    var finalCode = I.getCode(url);
    returnState=I.getState(url);
    console.log(`Current URL is [${finalCode}]`);
    var urlEncodedData = I.toUrlEncoded(finalCode);
    var response=await I.getResponseFromPost(urlEncodedData);
    await I.checkAssertion(response,state,returnState,nonce,"Level3","MinIDEkstern",process.env.MINID_USERNAME);
});