let accountId = "";
let myMsal = {};
let account = {};

var authButton;
var signOutButton;
// initClient();
function initOClient(username){
    const config = {
        auth: {
            clientId: OCLIENT_ID
        }
    };
    myMsal = new msal.PublicClientApplication(config);
    handleButtons(username);
    figureOutTheAccount(username);
    // console.log(myMsal.getAllAccounts());
}
function figureOutTheAccount(username){
    accounts = myMsal.getAllAccounts();
        for (let i = 0; i < accounts.length; i++) {
            if (accounts[i].username === username){
                account = accounts[i];
                authButton.style.display = 'none';
                signOutButton.style.display = 'block';
                callAPI(); //call the api, because we can
            }
        }
        if(jQuery.isEmptyObject(account)){
            authButton.style.display = 'block';
            signOutButton.style.display = 'none';
        }
}
// function updateOSigninStatus(username, authButton, signOutButton) {
//     if (isUserloggedIn(username)) {
//         authButton.style.display = 'none';
//         signOutButton.style.display = 'block';
//     } else {
//         authButton.style.display = 'block';
//         signOutButton.style.display = 'none';
//     }
//     figureOutTheAccount();
// }
function handleButtons(username){
    if(username === PERSONAL_USERNAME) {
        authButton = document.getElementById('authorize_button3');
        signOutButton = document.getElementById('signout_button3');
    } else{
        authButton = document.getElementById('authorize_button2');
        signOutButton = document.getElementById('signout_button2');
    }
    authButton.onclick = loginUser;
    signOutButton.onclick = LogoutUser;
}


function getOutlooks(accessToken){
    var headers = new Headers();
    var bearer = "Bearer " + accessToken;
    headers.append("Authorization", bearer);
    var options = {
        method: "GET",
        headers: headers
    };
    var graphEndpoint = "https://graph.microsoft.com/v1.0/me/messages";

    fetch(graphEndpoint, options)
        .then(function (response) {
            return response.json();
        }).then(function (data){
            console.log(data)
    });
}

/**
 * Acquires an access token and calls the api
 * @param account
 */
function callAPI(){
    const accessTokenRequest = {
        scopes: ["user.read", "Mail.ReadBasic", "Mail.Read","Mail.ReadWrite"],
        account: account,
    };
    myMsal
        .acquireTokenSilent(accessTokenRequest)
        .then(function (accessTokenResponse) {
            // Acquire token silent success
            let accessToken = accessTokenResponse.accessToken;
            // Call your API with token
            getOutlooks(accessToken);
        })
        .catch(function (error) {
            //Acquire token silent failure, and send an interactive request
            if (error.name === 'InteractionRequiredAuthError') {
                myMsal
                    .acquireTokenPopup(accessTokenRequest)
                    .then(function (accessTokenResponse) {
                        // Acquire token interactive success
                        let accessToken = accessTokenResponse.accessToken;
                        // Call your API with token
                        getOutlooks(accessToken);
                    })
                    .catch(function (error) {
                        // Acquire token interactive failure
                        console.log(error);
                    });
            }
            console.log(error);
        });
}
// function isUserloggedIn(username){
//     logged = false; //imagine megamind asking the question
//     accounts = this.authService.instance.getAllAccounts();
//     for (let i = 0; i < accounts.length && !logged; i++) {
//         if (username === accounts){
//             logged = true;
//         }
//     }
//     return logged;
// }
function loginUser(){
    const loginRequest = {
        scopes: ["User.ReadWrite"],
        prompt: 'login'
    }
    myMsal.loginPopup(loginRequest)
        .then(function (loginResponse) {
            username = loginResponse.account.username; //lazy but... lets just go with this ok shut up
            // Display signed-in user content, call API, etc.
            console.log(myMsal.getAllAccounts());
            figureOutTheAccount(username);
        }).catch(function (error) {
        //login failure
        console.log(error);
    });

}
function LogoutUser(){
    const logoutRequest = {
        account: myMsal.getAccountByHomeId(accountId)
    }
    myMsal.logoutPopup(logoutRequest)
        .then( function (logoutResponse){
            authButton.style.display = 'block';
            signOutButton.style.display = 'none';
    });
}
