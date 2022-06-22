function createBookmarkPopup(event, tab){
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

    addInputs(addBookmarkTab);
    addButtons(addBookmarkTab, tab);

    currentTab.appendChild(addBookmarkTab);
}

function displayTextInDiv(text, div, color){
    var papaDiv = div.parentNode;
    var otherPossibleHints = papaDiv.getElementsByClassName("bookmarkTextHint");
    for (let i = 0; i < otherPossibleHints.length; i++) { //bandaid fix
        $(otherPossibleHints[i]).remove();
    }
    var textSlot = document.createElement("p");
    textSlot.setAttribute("class", "bookmarkTextHint");
    // $(textSlot).css("text-align", "center");
    // $(textSlot).css("position", "absolute");
    // $(textSlot).css("top", "50%");
    // $(textSlot).css("left", "50%");
    // $(textSlot).css("font-weight", "bold");
    // $(textSlot).css("font-size", "11px");
    // $(textSlot).css("user-select", "none");
    // $(textSlot).css("transform", "translateX(-50%) translateY(-50%)");
    // $(textSlot).css("opacity", "1");
    $(textSlot).css("color", color);
    // switch (text) {
    //     case"GO":
    //         $(textSlot).css("color", "black");
    //         break;
    //     case "CREATE":
    //         $(textSlot).css("color", "black");
    //         break;
    //     default:
    //         $(textSlot).css("color", "white");
    //         break;
    // }
    textSlot.appendChild(document.createTextNode(text));
    var middleDiv=papaDiv.getElementsByClassName("middle")[0];
    $($(middleDiv).find("img")[0]).css("opacity", "0.2");
    // middleDiv.appendChild(textSlot);
    $(middleDiv).prepend(textSlot);
}

function purgeTextInDiv(div){
    var papaDiv = div.parentNode;
    var textSlot = papaDiv.querySelector(".bookmarkTextHint");
    $(textSlot).remove();
    var imgs = $(papaDiv).find("img");
    $(imgs[0]).css("opacity", "1");
}

function addInputs(addBookmarkTab){

    var link = document.createElement("input");
    link.setAttribute("type", "text");
    link.setAttribute("class", "links");
    link.setAttribute("placeholder", "LINK");


    var logo = document.createElement("input");
    logo.setAttribute("type", "text");
    logo.setAttribute("class", "links");
    logo.setAttribute("placeholder", "LOGO");

    var linkname = document.createElement("input");
    linkname.setAttribute("type", "text");
    linkname.setAttribute("class", "identification");
    linkname.setAttribute("placeholder", "NAME");

    addBookmarkTab.appendChild(link);
    addBookmarkTab.appendChild(logo);
    addBookmarkTab.appendChild(linkname);
}
function addButtons(addBookmarkTab, tab){
    var cancelButton = document.createElement("button")
    cancelButton.innerText = "CANCEL"
    $(cancelButton).css("float", "left");
    cancelButton.setAttribute("onclick", "removeBookmarkPopup("+tab + "," + "createBookmark" + tab+")");

    var createButton = document.createElement("button")
    createButton.setAttribute("onclick", "createBookmark(createBookmark" + tab+")");
    $(createButton).css("float", "right");
    // $(createButton).css("margin-top", "5px" );
    createButton.innerText = "CREATE"

    var chooseTabSelect = document.createElement("select");
    chooseTabSelect.setAttribute("class","selectTAB");
    var tabButtons = document.getElementsByClassName("tablinksBookmark");
    var index = 1; //uh, just don't ask...
    for (var tabButton of tabButtons) {
            var option = document.createElement("option");
            if(tabButton.classList.contains("active")){ // if the that button is the active tab
                option.setAttribute("selected", "selected")
            }
            option.setAttribute("value", "tab" + index);
            option.innerText = tabButton.innerText;
            chooseTabSelect.appendChild(option);
            index ++;
    }

    addBookmarkTab.appendChild(cancelButton);
    addBookmarkTab.appendChild(chooseTabSelect);
    addBookmarkTab.appendChild(createButton);
}
function removeBookmarkPopup(tab, bookmarkPopup){
    var bookmarksOfTab = tab.querySelector('.bookmarks');
    // var bookmarkPopup = currentTab.getElementById("createBookmark" + tab);
    bookmarksOfTab.style.display = 'block';
    $(bookmarkPopup).remove();

}

/**
 * Fetch bookmarks of tab from internal storage and appends it to the page.
 * @param tab
 */
function refreshBookmarks(tab){
    if( !localStorage.getItem("bookmarks" + tab)){
        console.log("no bookmarks found for " + tab)
    } else{
        var bookmarkList = JSON.parse(localStorage.getItem("bookmarks" + tab));
        for (const bookmarkListElement of bookmarkList) {
            displayBookmark(bookmarkListElement);
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
    topLeftCornerContainer.onclick = function() {expandBookmark(this)};
    topRightCornerContainer.onclick = function() {moveBookmark(this)};
    bottomLeftCornerContainer.onclick = function() {editBookmark(this);};
    bottomRightCornerContainer.onclick = function() {deleteBookmark(this); };

    bookmarkLink.setAttribute("href", bookmark.link);
    bookmarkImage.setAttribute("class", "bookmark");
    bookmarkImage.setAttribute("src", bookmark.imageSrc);
    $(bookmarkImage).css("display", "block");

    bookmarkName.setAttribute("class", "bookmarkName");
    bookmarkName.onmouseenter=function() {displayTextInDiv(bookmark.name, this, "black")};
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

    var bookmarks = currentTab.firstElementChild;
    bookmarks.insertBefore(bookmarkContainer, bookmarks.lastElementChild);// insert before addBookmark widget
}

/**
 * Fetch current form information to create a bookmark object and append it to internal storage.
 * @param tab
 */
function createBookmark(bookmarkPopup){ //tabsList are created here too btw
    var inputs = bookmarkPopup.childNodes;
    currentTabString = inputs[4].value;
    var id = currentTabString + "_0"; //example: tab1_0

    var newBookmark = new Bookmark(id,inputs[0].value, inputs[1].value, inputs[2].value, currentTabString);
    console.log(JSON.parse(localStorage.getItem("bookmarks" + currentTabString)));
    if( !localStorage.getItem("bookmarks" + currentTabString)){
        localStorage.setItem("index" + currentTabString, 1); // index always one ahead
        var bookmarkList = [];
        bookmarkList.push(newBookmark);
        localStorage.setItem("bookmarks" + currentTabString, JSON.stringify(bookmarkList));
    } else {
        addBookmark(newBookmark);
        displayBookmark(newBookmark);
    }
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
    console.log(bookmarkElement);
    removeBookmarkFromList(((bookmarkElement.parentElement).parentElement).id, bookmarkElement.id);
    $(bookmarkElement).remove();
}

/**
 * Modifies bookmark object from list
 * @param tab
 * @param bookmarkId
 */
function modifyBookmarkFromList(newBookmark){
    var modified = false;
    if( !localStorage.getItem("bookmarks" + newBookmark.tab)){
        console.log("no bookmarks found for " + newBookmark.tab)
    } else{
        var bookmarkList = JSON.parse(localStorage.getItem("bookmarks" + newBookmark.tab));
        for (let i = 0; i < bookmarkList.length || !modified; i++) {
            if((bookmarkList[i]).id === id){
                modified = true;
                //replace
                //put the list back in the storage
            }
        }
    }
    return modified;
}

/**
 * Get bookmark object from internal storage
 * returns null if nothing is found
 * @param id
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
function expandBookmark(bookmark){
    console.log(bookmark);
}

/**
 * Move the bookmark in a different location in its own DIV
 * @param bookmark
 */
function moveBookmark(bookmark){
    console.log(bookmark);
}

/**
 * edit current bookmark
 * @param bookmark
 */
function editBookmark(bookmark){
    console.log(bookmark);
}