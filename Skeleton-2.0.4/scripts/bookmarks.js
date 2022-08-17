let bookmarkNameColor = "color:rgb(122,255,122) ";
function createBookmarkPopup(tab){
    //hide current bookmarks to replace it later
    var currentTab = document.getElementById(tab);
    var bookmarksOfTab = currentTab.querySelector('.bookmarks');
    bookmarksOfTab.style.display = 'none'; //there's only one, so let's just go with this

    var bookmark = new Bookmark("test","test2","test3");
    var addBookmarkTab=document.createElement("div");
    addBookmarkTab.setAttribute("id","createBookmark" + tab);
    $(addBookmarkTab).css("border", "1px solid white");
    // $(addBookmarkTab).css("margin-top", "10px");
    $(addBookmarkTab).css("padding", "10px 10px 10px 10px");
    $(addBookmarkTab).css("border-radius", "16px");

    var bookmarkViewerElement = createBookmarkViewer(tab);

    addInputs(addBookmarkTab, bookmarkViewerElement);
    addButtons(addBookmarkTab, tab);

    currentTab.appendChild(addBookmarkTab);
}

/**
 * Viewer to see what you're creating, useless but cool af
 * @param addBookmarkTab
 * @param tab
 */
function createBookmarkViewer(tab) {
    // create null bookmark
    var tabElement= getTabById(tab);
    var emptyBookmark = new Bookmark("forShow" + tab, "", "","",  tab);
    var container = document.createElement("div");
    container.setAttribute("id", "viewer" + tab);
    container.setAttribute("class", "viewer container");
    // $(container).css("width", "50%");

    var bookmarkElement = displayBookmark(emptyBookmark);
    $(bookmarkElement).css("margin", "0 0 0 calc(50% - 36px) ");
    var bottomLeftCornerContainer=bookmarkElement.querySelector(".bottomLeftCorner.container");
    bottomLeftCornerContainer.onclick = function() {
        var stupidNotification = new NotificationDOM("Yup, you're already doing that.")
        stupidNotification.generateDomElement();
        this.parentNode.parentNode.parentNode.prepend(stupidNotification.domElement);
    };

    container.appendChild(bookmarkElement);
    tabElement.appendChild(container);

    return bookmarkElement;
}

function updateLinkViewer(link, bookmarkViewerElement){
    var bookmarkLink = bookmarkViewerElement.getElementsByTagName("a")[0];
    if(!((link.value).includes("https://")) && !((link.value).includes("http://")) ){
        bookmarkLink.href = "https://" + link.value;
    } else {
        bookmarkLink.href = link.value;
    }
}
function updateNameViewer(name, bookmarkViewerElement){
    var bookmarkName = bookmarkViewerElement.getElementsByClassName("bookmarkName")[0];
    bookmarkName.innerText = name.value;
}
function updateImageViewer(image, bookmarkViewerElement){
    var bookmarkImage = bookmarkViewerElement.getElementsByTagName("img")[0];
    bookmarkImage.src = image.value;
}

function displayTextInDiv(text, div, color){
    var papaDiv = div.parentNode;
    var otherPossibleHints = papaDiv.getElementsByClassName("bookmarkTextHint");
    for (let i = 0; i < otherPossibleHints.length; i++) { //bandaid fix
        $(otherPossibleHints[i]).remove();
    }
    var textSlot = document.createElement("span");
    textSlot.setAttribute("class", "bookmarkTextHint");
    $(textSlot).css("color", color);
    textSlot.appendChild(document.createTextNode(text));
    var middleDiv=papaDiv.getElementsByClassName("middle")[0];
    var img = $(middleDiv).find("img")[0];
    $(img).css("opacity", "0.2");
    // middleDiv.appendChild(textSlot);
    if(text === "GO" || text === "CREATE") { // if "GO" put text under the image so it's not clickable
        $(middleDiv).prepend(textSlot);
    } else{
        $(middleDiv).append(textSlot);
    }
}

function purgeTextInDiv(div){
    var papaDiv = div.parentNode;
    var textSlot = papaDiv.querySelector(".bookmarkTextHint");
    $(textSlot).remove();
    var imgs = $(papaDiv).find("img");
    $(imgs[0]).css("opacity", "1");
}

function autoFillBookmarkForm(link, logo, name){
    var currentLink = link.value; //test if link is valid
    if(!((currentLink).includes("https://")) && !((currentLink).includes("http://")) ){
        currentLink = "https://" + currentLink;
    }
    try {
        var url = new URL(currentLink);
        // https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://tenshi.moe//&size=256
        // logo.value = "https://icon.horse/icon/" + url.hostname;
        logo.value = "https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=" + url.origin + "&size=256";
        logo.dispatchEvent(new Event("input"));

        var hostname = url.hostname;
        var hostnameParts = hostname.split('.');
        if(hostnameParts.length === 2){// no prefix (length is 2)
            hostname = hostnameParts[0];
        } else{ // prefix detected
            hostname = hostnameParts[1];
        }
        name.value = (hostname).charAt(0).toUpperCase() + hostname.slice(1); // capitilize
        name.dispatchEvent(new Event("input"));
    } catch (_) {

    }
}

function addInputs(addBookmarkTab, bookmarkViewerElement){

    var link = document.createElement("input");
    link.setAttribute("type", "text");
    link.setAttribute("class", "links");
    link.setAttribute("placeholder", "LINK");
    link.addEventListener('input', function (evt){
        updateLinkViewer(link, bookmarkViewerElement);
        autoFillBookmarkForm(link, logo, name);
    });


    var logo = document.createElement("input");
    logo.setAttribute("type", "text");
    logo.setAttribute("class", "links");
    logo.setAttribute("placeholder", "LOGO");
    logo.addEventListener('input', function (evt){
        updateImageViewer(logo, bookmarkViewerElement);
    });
    // logo.onkeypress = function (){updateBookmarkViewer(addBookmarkTab, bookmarkElement)};

    var name = document.createElement("input");
    name.setAttribute("type", "text");
    name.setAttribute("class", "identification");
    name.setAttribute("placeholder", "NAME");
    name.addEventListener('input', function (evt){
        updateNameViewer(name, bookmarkViewerElement);
    });

    addBookmarkTab.appendChild(link);
    addBookmarkTab.appendChild(logo);
    addBookmarkTab.appendChild(name);
}
function addButtons(addBookmarkTab, tab){
    var cancelButton = document.createElement("button")
    cancelButton.innerText = "CANCEL"
    $(cancelButton).css("float", "left");
    cancelButton.setAttribute("onclick", "removeBookmarkPopup("+tab + "," + "createBookmark" + tab+")");

    var createButton = document.createElement("button")
    createButton.setAttribute("onclick", "onAddBookmarkButtonClick(createBookmark" + tab+")");
    $(createButton).css("float", "right");
    // $(createButton).css("margin-top", "5px" );
    createButton.innerText = "CREATE"

    var chooseTabSelect = document.createElement("select");
    chooseTabSelect.setAttribute("class","selectTAB");
    var tabButtons = document.getElementsByClassName("tablinksBookmark");
    var tabDIVs = document.getElementsByClassName("tabcontentBookmark");

    for (let i = 0; i < tabButtons.length; i++) {
        var option = document.createElement("option");
        if(tabButtons[i].classList.contains("active")){ // if the that button is the active tab
            option.setAttribute("selected", "selected")
        }
        option.setAttribute("value", tabDIVs[i].id);
        option.innerText = tabButtons[i].innerText;
        chooseTabSelect.appendChild(option);
    }

    addBookmarkTab.appendChild(cancelButton);
    addBookmarkTab.appendChild(chooseTabSelect);
    addBookmarkTab.appendChild(createButton);
}
function removeBookmarkPopup(tab, bookmarkPopup){
    var bookmarksOfTab = tab.querySelector('.bookmarks');
    var viewer = document.getElementById("viewer" + tab.id);
    // var bookmarkPopup = currentTab.getElementById("createBookmark" + tab);
    bookmarksOfTab.style.display = 'block';
    $(bookmarkPopup).remove();
    $(viewer).remove();

}

/**
 * Fetch bookmarks of tab from internal storage and appends it to the page.
 * @param tab
 */
function refreshBookmarks(tab){
    var bookmarkList = [];
    if( !localStorage.getItem("bookmarks" + tab)){ //if there's no bookmark add the default widget
        localStorage.setItem("index" + tab, 1); // index always one ahead
        bookmarkList.push(new Bookmark("Add" + tab, "", "", "", tab));// add
        localStorage.setItem("bookmarks" + tab, JSON.stringify(bookmarkList));
    } else{
        bookmarkList = JSON.parse(localStorage.getItem("bookmarks" + tab));
        var bookmarksContainer = getTabById(tab).getElementsByClassName("bookmarks container");
        $(bookmarksContainer).empty();// man... jquery is funny
    }
    displayBookmarks(bookmarkList,tab)
}
function generateAddBookmarkBookmark(tab){
    var bookmarksContainer = getTabById(tab).getElementsByClassName("bookmarks container")[0];

    var bookmarkContainer = document.createElement("div")
    var middleContainer = document.createElement("div")
    var topRightCornerContainer = document.createElement("div")
    var bookmarkImage = document.createElement("img");
    var bookmarkName = document.createElement("p");

    bookmarkContainer.setAttribute("class", "bookmark container");
    bookmarkContainer.setAttribute("id", "Add" + tab);
    middleContainer.setAttribute("class", "middle container");
    topRightCornerContainer.setAttribute("class", "topRightCorner container");

    middleContainer.onmouseover = function() {displayTextInDiv('CREATE', this, "white")};
    topRightCornerContainer.onmouseover = function() {displayTextInDiv('MOVE', this, "white")};

    middleContainer.onmouseleave = function() {purgeTextInDiv(this)};
    topRightCornerContainer.onmouseleave = function() {purgeTextInDiv(this)};

    middleContainer.onclick = function() {createBookmarkPopup( tab)};
    // topRightCornerContainer.onmousedown = function() {moveBookmark(this)};
    topRightCornerContainer.addEventListener('mousedown', function (evt){
        onMoveBookmarkButtonClicked(topRightCornerContainer, evt);
    });
    topRightCornerContainer.style.cursor = "grab";

    bookmarkImage.setAttribute("class", "bookmark");
    bookmarkImage.setAttribute("src", "images/plus.svg");
    $(bookmarkImage).css("display", "block");

    bookmarkName.setAttribute("class", "bookmarkName");
    bookmarkName.onmouseenter=function() {displayTextInDiv(this.innerText, this, "black")};
    bookmarkName.onmouseleave=function() {purgeTextInDiv(this);};
    bookmarkName.appendChild(document.createTextNode("Add New"));

    //append -ix
    middleContainer.appendChild(bookmarkImage);
    bookmarkContainer.appendChild(bookmarkName);
    bookmarkContainer.appendChild(middleContainer);
    bookmarkContainer.appendChild(topRightCornerContainer);

    bookmarksContainer.appendChild(bookmarkContainer);
}

function displayBookmarks(bookmarkList, tab){
    var bookmarks = getTabById(tab).getElementsByClassName("bookmarks container")[0];
    for (const bookmarkListElement of bookmarkList) {
        if(bookmarkListElement.id === "Add" + tab){
            generateAddBookmarkBookmark(tab);
        } else{
            bookmarks.appendChild(displayBookmark(bookmarkListElement));// going national baby
        }
    }
}

function displayBookmark(bookmark){
    var bookmarkContainer = document.createElement("div")
    var middleContainer = document.createElement("div")
    var topLeftCornerContainer = document.createElement("div")
    var topRightCornerContainer = document.createElement("div")
    var bottomLeftCornerContainer = document.createElement("div")
    var bottomRightCornerContainer = document.createElement("div")
    var bookmarkLink = document.createElement("a");
    var bookmarkImage = document.createElement("img");
    var bookmarkName = document.createElement("p");
    var currentTab = document.getElementById(bookmark.tab);

    bookmarkContainer.setAttribute("class", "bookmark container");
    bookmarkContainer.setAttribute("id", bookmark.id);
    middleContainer.setAttribute("class", "middle container");
    topLeftCornerContainer.setAttribute("class", "topLeftCorner container");
    topRightCornerContainer.setAttribute("class", "topRightCorner container");
    bottomLeftCornerContainer.setAttribute("class", "bottomLeftCorner container");
    bottomRightCornerContainer.setAttribute("class", "bottomRightCorner container");

    middleContainer.onmouseover = function() {displayTextInDiv('GO', this, "black")};
    topLeftCornerContainer.onmouseover = function() {displayTextInDiv('EXPAND', this, "white")};
    topRightCornerContainer.onmouseover = function() {displayTextInDiv('MOVE', this, "white")};
    bottomLeftCornerContainer.onmouseover = function() {displayTextInDiv('EDIT', this, "white")};
    bottomRightCornerContainer.onmouseover = function() {displayTextInDiv('DELETE', this, "white")};

    middleContainer.onmouseleave = function() {purgeTextInDiv(this)};
    topLeftCornerContainer.onmouseleave = function() {purgeTextInDiv(this)};
    topRightCornerContainer.onmouseleave = function() {purgeTextInDiv(this)};
    bottomLeftCornerContainer.onmouseleave = function() {purgeTextInDiv(this);};
    bottomRightCornerContainer.onmouseleave = function() {purgeTextInDiv(this); };

    middleContainer.onclick = function() {};
    topLeftCornerContainer.onclick = function() {onExpandBookmarkButtonClicked(this.parentNode)};
    topRightCornerContainer.addEventListener('mousedown', function (evt){
        onMoveBookmarkButtonClicked(topRightCornerContainer, evt);
    });
    topRightCornerContainer.style.cursor = "grab";
    bottomLeftCornerContainer.onclick = function() {editBookmark(this.parentNode);};
    bottomRightCornerContainer.onclick = function() {deleteBookmark(this); };

    bookmarkLink.href = bookmark.link;
    bookmarkImage.className = "bookmark";
    bookmarkImage.src = bookmark.imageSrc;
    bookmarkImage.onerror = function (){
        this.src = "images/defaultBookmarkImage.png";
        this.onerror = function(){
            this.src = ""; //if defaultBookmarkImage.png is not found, avoids an infinite loop
        }
    }
    bookmarkImage.style.display = "block";

    bookmarkName.setAttribute("class", "bookmarkName");
    bookmarkName.onmouseenter=function() {displayTextInDiv(this.innerText, this, "black")};
    bookmarkName.onmouseleave=function() {purgeTextInDiv(this);};
    bookmarkName.appendChild(document.createTextNode(bookmark.name));

    //append -ix
    bookmarkLink.appendChild(bookmarkImage);
    middleContainer.appendChild(bookmarkLink);
    bookmarkContainer.appendChild(bookmarkName);
    bookmarkContainer.appendChild(middleContainer);
    bookmarkContainer.appendChild(topLeftCornerContainer);
    bookmarkContainer.appendChild(topRightCornerContainer);
    bookmarkContainer.appendChild(bottomLeftCornerContainer);
    bookmarkContainer.appendChild(bottomRightCornerContainer);

    return bookmarkContainer;
}

function onAddBookmarkButtonClick(bookmarkPopup){
    var tabElement = bookmarkPopup.parentElement;
    var inputs = bookmarkPopup.childNodes;
    createBookmark(inputs[4].value, inputs[0].value, inputs[1].value, inputs[2].value);
    removeBookmarkPopup(tabElement, bookmarkPopup);

    var notification = new TimedNotification("has successfully been added", 5000);
    notification.generateDomElement();
    notification.setInformationBackgroundColor("rgba(0, 0, 200, 0.1)")
    var information = notification.domElement.querySelector("p"); //I have to change the innerHTML
    information.innerHTML = "<span style=\""+bookmarkNameColor+"\">" + inputs[2].value  + "</span> " + information.innerHTML;
    tabElement.prepend(notification.domElement); //tab
    notification.startTimer();
}

/**
 * Fetch current form information to create a bookmark object and append it to internal storage.
 * @param tabId
 * @param link
 * @param imageSrc
 * @param name
 */
function createBookmark(tabId, link, imageSrc, name){ //tabsList are created here too btw
    var id = tabId + "_0"; //example: tab1_0
    var bookmarks = getTabById(tabId).firstElementChild;
    if(!((link).includes("https://")) && !((link).includes("http://")) ){
        link = "https://" + link;
    }
    var newBookmark = new Bookmark(id,link, imageSrc, name, tabId);
    console.log(JSON.parse(localStorage.getItem("bookmarks" + tabId)));
    if( !localStorage.getItem("bookmarks" + tabId)){
        // localStorage.setItem("index" + currentTabString, 1); // index always one ahead
        // var bookmarkList = [];
        // bookmarkList.push(new Bookmark("Add" + currentTabString, "", "", "", currentTabString));// add
        // bookmarkList.push(newBookmark);
        // localStorage.setItem("bookmarks" + currentTabString, JSON.stringify(bookmarkList));
        // bookmarks.insertBefore(displayBookmark(newBookmark), bookmarks.lastElementChild);// insert before addBookmark widget
        console.log("The bookmark list for tab: " + tabId + " should really exist, but it doesn't somehow.. refresh the page");
    } else {
        addBookmark(newBookmark);
        bookmarks.appendChild(displayBookmark(newBookmark));//
    }
}

function getTabById(id){
    return document.getElementById(id);
}
/**
 * Appends a bookmark object to the internal storage
 * @param bookmark
 */
function addBookmark(bookmark ){
    var bookmarkList = JSON.parse(localStorage.getItem("bookmarks" + bookmark.tab));
    var index = localStorage.getItem("index" + bookmark.tab);
    bookmark.id = bookmark.tab + "_" + index;
    index++;
    localStorage.setItem("index" + bookmark.tab, index);
    bookmarkList.push(bookmark);
    localStorage.setItem("bookmarks" + bookmark.tab, JSON.stringify(bookmarkList));
}

/**
 * Deletes a bookmark from the internal storage
 * @param tab
 */
function removeBookmarkFromList(tab, id ){
    var deleted = false;
    if( !localStorage.getItem("bookmarks" + tab)){
        console.log("no bookmarks found for " + tab)
    } else{
        var bookmarkList = JSON.parse(localStorage.getItem("bookmarks" + tab));
        for (let i = 0; i < bookmarkList.length || !deleted ; i++) {
            if((bookmarkList[i]).id === id){
                bookmarkList.splice(i, 1); //delete
                localStorage.setItem("bookmarks" + tab, JSON.stringify(bookmarkList));//put the list back in the storage
                deleted = true;
            }
        }
    }
    return deleted;
}

/**
 * Delete bookmark
 * @param bookmark
 */
function deleteBookmark(bookmarkBottomRightDIV){
    var bookmarkElement = bookmarkBottomRightDIV.parentElement;
    var tab = (bookmarkElement.parentElement).parentElement;
    var bookmarkName = bookmarkElement.getElementsByClassName("bookmarkName")[0].innerHTML;
    console.log(bookmarkElement);
    $(bookmarkElement).css("display","none");

    var notification = new TimedBookmarkDeletedNotification("has successfully been deleted", 5000, bookmarkElement);
    notification.generateDomElement();
    notification.setInformationBackgroundColor("rgba(200, 0, 0, 0.1)")
    var information = notification.domElement.querySelector("p"); //I have to change the innerHTML
    information.innerHTML = "<span style=\""+bookmarkNameColor+"\">" + bookmarkName  + "</span> " + information.innerHTML;
    tab.prepend(notification.domElement); //tab
    notification.startTimer("actuallyDeleteBookmarkThisTimeISwear("+ bookmarkElement.id + ")");
}

function actuallyDeleteBookmarkThisTimeISwear(bookmark){
    removeBookmarkFromList(((bookmark.parentElement).parentElement).id, bookmark.id);
    $(bookmark).remove();
    // console.log(bookmark.id + " deleted")
}

function bookmarkSavedFromDeletion(bookmark){
    var tab = (bookmark.parentElement).parentElement;
    var bookmarkName = bookmark.getElementsByClassName("bookmarkName")[0].innerHTML;
    var notification = new TimedNotification(" has been successfully restored!", 1000 );
    notification.generateDomElement();
    notification.setInformationBackgroundColor("rgba(0, 0, 200, 0.1)")
    var information = notification.domElement.querySelector("p"); //I have to change the innerHTML
    information.innerHTML = "<span style=\""+bookmarkNameColor+"\">" + bookmarkName  + "</span> " + information.innerHTML;
    tab.prepend(notification.domElement); //tab
    notification.startTimer("");
}

/**
 * Modifies bookmark object from list
 * @param newBookmark
 */
function modifyBookmarkFromList(newBookmark, oldTabId){
    var modified = false;
    if(oldTabId === newBookmark.tab){
        if( !localStorage.getItem("bookmarks" + newBookmark.tab)){
            console.log("no bookmarks found for " + newBookmark.tab)
        } else{
            var bookmarkList = JSON.parse(localStorage.getItem("bookmarks" + newBookmark.tab));
            for (let i = 0; i < bookmarkList.length && !modified; i++) {
                if((bookmarkList[i]).id === newBookmark.id){
                    modified = true;
                    bookmarkList[i] = newBookmark;
                    localStorage.setItem("bookmarks" + newBookmark.tab, JSON.stringify(bookmarkList));
                }
            }
        }
    } else{
        removeBookmarkFromList(oldTabId, newBookmark.id);
        createBookmark(newBookmark.tab, newBookmark.link, newBookmark.imageSrc, newBookmark.name );
    }

    return modified;
}

/**
 * Moves a bookmark from one index to another in the internal storage (*not visually).
 * @param bookmarkId
 * @param index
 * @param tabId
 */
function moveBookmarkToIndex(bookmarkId, index, tabId){
    if(bookmarkId.includes("forShow")){
        console.log("just for show");
    }else {
        var found = false
        if (!localStorage.getItem("bookmarks" + tabId)) {
            console.log("no bookmarks found for " + tabId)
        } else {
            var bookmarkList = JSON.parse(localStorage.getItem("bookmarks" + tabId));
            for (let i = 0; i < bookmarkList.length || !found; i++) {
                if ((bookmarkList[i]).id === bookmarkId) {
                    found = true;
                    if (i !== index) { //same index means it hasn't moved
                        var bookmarkCopy = {...bookmarkList[i]}; //make a copy of the bookmark
                        bookmarkList.splice(i, 1); // delete bookmark (we'll re-add it later)
                        bookmarkList.splice(index, 0, bookmarkCopy);
                        localStorage.setItem("bookmarks" + tabId, JSON.stringify(bookmarkList));
                    }
                }
            }
        }
    }
}

/**
 * Get bookmark object from internal storage
 * returns null if nothing is found
 * @param id
 * @param tab
 */
function fetchBookmark(id, tab){
    var bookmark = null;
    if( !localStorage.getItem("bookmarks" + tab)){
        console.log("no bookmarks found for " + tab)
    } else{
        var bookmarkList = JSON.parse(localStorage.getItem("bookmarks" + tab));
        for (let i = 0; i < bookmarkList.length || bookmark !== null; i++) {
            if((bookmarkList[i]).id === id){
                bookmark = bookmarkList[i];
            }
        }
    }
    return bookmark;
}

/**
 * Embed the website target in an iframe.
 * @param bookmark
 */
function onExpandBookmarkButtonClicked(bookmark){
    var bookmarksContainer = bookmark.parentNode;
    var tabObject = bookmarksContainer.parentNode;
    var virtualWindow = document.createElement("div");
    var iframe = document.createElement("iframe");
    var terminateAction = document.createElement("button");
    var bookmarkName = bookmark.querySelector("p").innerText;
    terminateAction.style.float = "left";
    terminateAction.style.width = "100%";
    terminateAction.innerHTML = "CLOSE "+bookmarkName;
    terminateAction.onclick = function (){
        virtualWindow.remove();
        bookmarksContainer.style.display = "block";
    }
    // $(iframe).attr("is", "x-frame-bypass");
    iframe.id = bookmark.id + "Iframe";
    iframe.title = bookmarkName + "'s virtual window";
    iframe.src = bookmark.querySelector("a").href;
    iframe.width = "100%";
    iframe.allowFullscreen = true;
    iframe.height = "600px";
    iframe.className = "bookmarkIframe";
    bookmarksContainer.style.display = "none";
    virtualWindow.className = "virtualWindow";
    virtualWindow.appendChild(iframe);
    virtualWindow.appendChild(terminateAction);
    tabObject.appendChild(virtualWindow);
    // console.log(bookmark);
}

function quitVirtualWindow(){

}

/**
 * Move the bookmark in a different location in the container
 * @param moveButton
 * @param evt
 */
function onMoveBookmarkButtonClicked(moveButton, evt){
    var bookmark = moveButton.parentNode;
    moveButton.style.cursor = "grabbing";
    dragBookmark(bookmark,evt);
}

/**
 * edit create a addBookmarkPopup and modify its values to make it modify a bookmark instead
 * @param bookmark
 */
function editBookmark(bookmark){ //the great scuffening
    var waitNotif = new NotificationDOM("please wait a moment..."); //notification because I want to edit the popup before it's seen, rudimentary really
    waitNotif.generateDomElement();

    var tab = (bookmark.parentNode).parentNode;
    tab.appendChild(waitNotif.domElement);

    createBookmarkPopup(tab.id);//create an add bookmark popup

    var popup = document.getElementById("createBookmark" + tab.id); //told you it was scuffed, but this is just beginning
    var viewer = document.getElementById("viewer" + tab.id);

    $(popup).css("display", "none");
    $(viewer).css("display", "none");
    var modifyButton = (popup.getElementsByTagName("button"))[1];
    var inputs = popup.getElementsByTagName("input");

    modifyButton.innerText = "MODIFY";
    var link = bookmark.getElementsByTagName("a")[0];
    var logo = bookmark.getElementsByTagName("img")[0];
    var name = bookmark.getElementsByClassName("bookmarkName")[0];
    var tabToAppendTo = popup.getElementsByTagName("select")[0];

    inputs[0].value = link.href
    inputs[0].dispatchEvent(new Event("input")); //update viewer

    inputs[1].value = logo.src
    inputs[1].dispatchEvent(new Event("input"));

    inputs[2].value = name.innerText
    inputs[2].dispatchEvent(new Event("input"));

    modifyButton.onclick = function (){
        var bookmarkObject = new Bookmark(bookmark.id, inputs[0].value, inputs[1].value, inputs[2].value, tabToAppendTo.value);
        modifyBookmarkFromList(bookmarkObject, tab.id);
        refreshBookmarks(tab.id);
        removeBookmarkPopup(tab, popup);
        var notification = new TimedNotification("has been successfully modified", 1);
        notification.generateDomElement();
        var information = notification.domElement.querySelector("p"); //I have to change the innerHTML
        information.innerHTML = "<span style=\""+bookmarkNameColor+"\">" + inputs[2].value  + "</span> " + information.innerHTML;
        tab.prepend(notification.domElement);
        notification.startTimer();
    }
    $(popup).css("display", "block");
    $(viewer).css("display", "block");
    waitNotif.deleteDomElement();
}
