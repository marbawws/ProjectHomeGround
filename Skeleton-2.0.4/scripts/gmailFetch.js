// Client ID and API key from the Developer Console

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.labels ' +
    'https://www.googleapis.com/auth/gmail.modify';

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

let waitGmailNotification;

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initGClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
async function initGClient() {
    await gapi.client.init({
        apiKey: GAPI_KEY,
        clientId: GCLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    })
        .then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateGSigninStatus);

        // Handle the initial sign-in state.
        updateGSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
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
function updateGSigninStatus(isSignedIn) {
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
    eraseDivs("gmail");//secure sign out :)
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendDiv(subject, from, date, data, read, id) { //laugh at the date not being used, haha what a nerd
    var styleText = "";
    var styleImg = "";

    $("<div id="+removeSpecialCharacters(id)+" class='gmail container' onclick='generateEmailWindow(`"+Base64.encode(from)+"`,`"+ Base64.encode(subject)+"`,`"+date +"`,`"+ data +"`,`"+Base64.encode(id)+"`,`"+ Base64.encode("") +"`,`"+ read +"`)'>"
        + "<p style='"+styleText+"'class='gmail'><a href='https://mail.google.com/mail/u/0/#inbox'><img class='bookmark noPropagation' src='images/gmail.svg' style='"+styleImg+";float: left;width: 22px; height: 22px' ></a>"
        + "<b>&nbsp;" + from + "</b>"
        + "&nbsp;&nbsp;" + subject + "&nbsp;"+"</p></div>").appendTo("#gmails")
    if(read){
        changeReadEmailCSS(id); //does pretty cool shit, check it out yoyo
    }
}

function removeSpecialCharacters(stringToReplace){
    return stringToReplace.replace(/[^\w\s]/gi, '')
}

/**
 * Print all Labels in the authorized user's inbox. If no labels
 * are found an appropriate message is printed.
 */
async function getMessages() {
    waitGmailNotification = new NotificationDOM("Fetching emails...")
    waitGmailNotification.generateDomElement();
    document.getElementById("gmails").appendChild(waitGmailNotification.domElement);

    var matriceMessages = [];
    response = await fetchMessagesMetadata(10);
    var messages = response.result.messages;
    i = 0;
    for (const message of messages) {
        var read = true;
        response = await fetchMessageDetails(message.id);
        console.log(response);
        headers = response.result.payload.headers;
        if(response.result.labelIds[0] === "UNREAD"){// check if read
            read = false;
        }
        matriceMessages[i] = populateMessage(headers, response.result.payload, read, message.id);
        i++;
        if (matriceMessages.length === 10) { // async bullshit, callback garbage
            // console.log(matriceMessages);
            waitGmailNotification.dismissed(); // automatically delete notification right before adding the messages
            matriceMessages = orderMessages(matriceMessages); //ordered by date
            matriceMessages.forEach(message => {
                displayMessages(message);
            });
        }
    }
    $(".noPropagation").on("click", function(event){
        event.stopPropagation();
        console.log( "I was clicked, but my parent will not be." );
    });// yo :^)
}
function getHtmlEncodedContent(payload) { //content of messages are encrypted and separated in parts.. sometimes
    var html ;
    var htmled = false
    if (payload.body.size > 0) {
        html = payload.body.data;
    } else {
        for (let i = 0; i < (payload.parts).length && !htmled; i++) {
            switch(payload.parts[i].mimeType){
                case "text/html":
                    html = payload.parts[i].body.data;
                    htmled = true; //prefer html, if it finds html keep it
                    break;
                case "text/plain":
                    html = payload.parts[i].body.data;
                    break;
                case "multipart/alternative": //this shit is absurd, strap in, onlooker
                    return getHtmlEncodedContent(payload.parts[i]);

                case "multipart/related": //I found.. yet.. another
                    return getHtmlEncodedContent(payload.parts[i]);
            }
        }
    }
    return html
}

async function fetchMessagesMetadata(nb) {
    return (gapi.client.gmail.users.messages.list({
        'userId': 'me',
        'labelIds': 'INBOX',
        'maxResults': nb
    }));
}
async function removeUnReadLabel(messageId) {
    return (gapi.client.gmail.users.messages.modify({
        'userId': 'me',
        'id': messageId,
        'removeLabelIds': ['UNREAD']
    }));
}
async function fetchMessageDetails(messageID) {
    return (gapi.client.gmail.users.messages.get({
        'userId': 'me',
        'id': messageID
    }));
}
function populateMessage(headers, payload, read, id) {
    var messageInfo = [];
    headers.forEach(header => {
        if (header.name === "Subject") {
            messageInfo[0] = header.value;
        }
        if (header.name === "From") {
            messageInfo[1] = header.value;
        }
        if (header.name === "Date") {
            messageInfo[2] = header.value;
        }
    });
    messageInfo[3] = getHtmlEncodedContent(payload);
    messageInfo[4] = read;
    messageInfo[5] = id;
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
    appendDiv(message[0], message[1], message[2], message[3], message[4], message[5]);
}

function refreshGmail(event){
    eraseDivs("gmail");
    getMessages();
}