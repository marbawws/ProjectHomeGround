// Client ID and API key from the Developer Console

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');


/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function (error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        getMessages();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendDiv(subject, from, date) { //laugh at the date not being used, haha what a nerd
    $("<div class='gmail container' onclick='generateEmailWindow(`"+from+"`,`"+ subject+"`,`"+subject +"`)'>"
        + "<p class='gmail'><a href='https://mail.google.com/mail/u/0/#inbox'><img class='notransparentTwet' src='images/gmail.svg' style='float: left;width: 22px; height: 22px' ></a>"
        + "<b>&nbsp;" + from + "</b>"
        + "&nbsp;&nbsp;" + subject + "&nbsp;"+"</p></div>").appendTo("#gmails")
    // $("<p>"+ message + "</p>").appendTo("#gmails")
}

/**
 * Print all Labels in the authorized user's inbox. If no labels
 * are found an appropriate message is printed.
 */
async function getMessages() {
    var matriceMessages = [];
    response = await fetchMessagesMetadata(10);
    var messages = response.result.messages;
    i = 0;
    messages.forEach(async message => {
        response = await fetchMessageDetails(message.id)
        headers = response.result.payload.headers
        matriceMessages[i] = populateMessage(headers);
        i++;
        if (matriceMessages.length == 10) { // async bullshit, callback garbage
            console.log(matriceMessages);
            matriceMessages = orderMessages(matriceMessages); //ordered by date
            matriceMessages.forEach(message => {
                displayMessages(message);
            });
        }
    })
}
async function fetchMessagesMetadata(nb) {
    return (gapi.client.gmail.users.messages.list({
        'userId': 'me',
        'labelIds': 'INBOX',
        'maxResults': nb
    }))
}
async function fetchMessageDetails(messageID) {
    return (gapi.client.gmail.users.messages.get({
        'userId': 'me',
        'id': messageID
    }))
}
function populateMessage(headers) {
    var messageInfo = [];
    headers.forEach(header => {
        if (header.name == "Subject") {
            messageInfo[0] = header.value;
        }
        if (header.name == "From") {
            messageInfo[1] = header.value;
        }
        if (header.name == "Date") {
            messageInfo[2] = header.value;
        }
    })
    return messageInfo;
}

function orderMessages(matriceMessages) {
    return matriceMessages.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b[2]) - new Date(a[2]);
    });

}

function displayMessages(message) {
    message[1] = (message[1].split('<'))[0] // keep only name
    // message[0] = message[0].substring(0, 42) + "...";
    appendDiv(message[0], message[1], message[2]);
}

function erasePreviousGmails(){
    $('div.' + "gmail").remove();
    console.log();
}