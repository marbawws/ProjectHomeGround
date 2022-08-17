let accountId = "";
let myMsal = {};
let account = {};

var authButton;
var signOutButton;

let waitOutlook1Notification;
let waitOutlook2Notification;


// initClient();
function initOClient(username){
    account = {}; //reset the account because class is being reinitialized probably because a new email is being processed
    const config = {
        auth: {
            clientId: OCLIENT_ID
        },
        cache: {
            cacheLocation: "localStorage"
        }
    };
    myMsal = new msal.PublicClientApplication(config);
    // myMsal.Storage("localStorage");
    handleButtons(username);
    figureOutTheAccount(username);
    // console.log(myMsal.getAllAccounts());
}
function figureOutTheAccount(username){

    if(username === PERSONAL_USERNAME){
        waitOutlook2Notification = new NotificationDOM("Fetching emails...")
        waitOutlook2Notification.generateDomElement();
        document.getElementById("outlooks2").appendChild(waitOutlook2Notification.domElement);
    } else {
        waitOutlook1Notification = new NotificationDOM("Fetching emails...")
        waitOutlook1Notification.generateDomElement();
        document.getElementById("outlooks1").appendChild(waitOutlook1Notification.domElement);
    }

    accounts = myMsal.getAllAccounts();
    console.log(accounts);
        for (let i = 0; i < accounts.length; i++) {
            if (accounts[i].username === username){
                account = accounts[i];
                authButton.style.display = 'none';
                signOutButton.style.display = 'block';
                callAPI(username); //call the api, because we can
            }
        }
        if(jQuery.isEmptyObject(account)){
            authButton.style.display = 'block';
            signOutButton.style.display = 'none';
        }
}

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


function fetchMessagesOutlook(accessToken){
    var headers = new Headers();
    var bearer = "Bearer " + accessToken;
    headers.append("Authorization", bearer);
    var options = {
        method: "GET",
        headers: headers
    };
    var graphEndpoint = "https://graph.microsoft.com/v1.0/me/messages";

    return fetch(graphEndpoint, options) //don't question this block, async was a mistake
        .then(function (response) {
            return response.json();
        }).then(function (data){
            return data;
    });
}
function outlookRead(messageId, accessToken){
    var headers = new Headers();
    var bearer = "Bearer " + accessToken;
    headers.append("Authorization", bearer);
    headers.append("Content-type", "application/json");
    json = {"isRead": true};
    var options = {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify(json)
    };
    console.log(options);
    var graphEndpoint = "https://graph.microsoft.com/v1.0/me/messages/" + messageId;

    return fetch(graphEndpoint, options) //don't question this block, async was a mistake
        .then(function (response) {
            return response.json();
        }).then(function (data){
            return data;
        });
}

function appendDivOutlook(subject, from, date, data, username, isRead, id, token) {
    var destination;
    var divName;

    if(username === PERSONAL_USERNAME){ // very scuffed, but hey does it work? yes, then it just works ;)
        destination = "#outlooks2";
        divName = "outlook2"
    } else {
        destination = "#outlooks1";
        divName = "outlook1"
    }
    $("<div id="+removeSpecialCharacters(id)+" class='" + divName + " container" + "' onclick='generateEmailWindow(`"+Base64.encode(from)+"`,`"+ Base64.encode(subject)+"`,`"+date +"`,`"+ Base64.encode(data) +"`,`"+ Base64.encode(id) +"`,`"+ Base64.encode(token) +"`,`"+ isRead +"`)'>"
        + "<p class="+divName+"><a href='https://outlook.live.com/mail/0/'><img class='bookmark noPropagation' src='images/outlook.svg' style='float: left;width: 22px; height: 22px' ></a>"
        + "<b>&nbsp;" + from + "</b>"
        + "&nbsp;&nbsp;" + subject + "&nbsp;"+"</p></div>").appendTo(destination);
    if(isRead){
        changeReadEmailCSS(id);
    }
}

async function getOutlooks(accessToken, username){ //very similar to getMessages in gmail, but msal is cool so im approaching things a bit differently
    var response = await fetchMessagesOutlook(accessToken);//straight up contains every message, how can gapi compete?
    var messages = response.value;
    if(username === PERSONAL_USERNAME) {
        waitOutlook2Notification.dismissed();
    } else{
        waitOutlook1Notification.dismissed();
    }
    for(const message of messages){
        // console.log(message);
        var sender;
        if(username === SCHOOL_USERNAME){

            sender = getTextBetweenTwoClauses(message.bodyPreview, "From: ", " <");
            if(sender === null){ //if message doesnt come from the school account but from the proxy account
                sender = message.sender.emailAddress.name;
            } else {
               sender = sender[0];
            }
        } else {
            sender = message.sender.emailAddress.name;
        }
        appendDivOutlook(message.subject, sender ,
            message.receivedDateTime, message.body.content,
            username, message.isRead, message.id, accessToken); //token here and not global because account often changes
    }
    $(".noPropagation").on("click", function(event){
        event.stopPropagation();
        console.log( "I was clicked, but my parent will not be." );
    });// oh yeah baby
}
/**
 * Acquires an access token and calls the api
 * @param account
 */
function callAPI(username){
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
            getOutlooks(accessToken, username);
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
                        getOutlooks(accessToken, username);
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
        prompt: ''
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
            console.log(account);
            if(account.username === PERSONAL_USERNAME) {
                eraseDivs("outlook2");
            }else{
                eraseDivs("outlook1");
            }
            account = {};
    });
}

function refreshOutlook1(){
    account = {};//wipe account from memory
    eraseDivs("outlook1");
    figureOutTheAccount(SCHOOL_USERNAME);
}
function refreshOutlook2(){
    account = {};//wipe account from memory
    eraseDivs("outlook2");
    figureOutTheAccount(PERSONAL_USERNAME);
}

