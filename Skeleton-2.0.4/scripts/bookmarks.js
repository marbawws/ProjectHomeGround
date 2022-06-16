function createBookmarkPopup(event, tab){
    //hide current bookmarks to replace it later
    var currentTab = document.getElementById(tab);
    var bookmarksOfTab = currentTab.querySelector('.bookmarks');
    bookmarksOfTab.style.display = 'none'; //there's only one, so let's just go with this

    var bookmark = new Bookmark("test","test2","test3");
    var addBookmarkTab=document.createElement("div");
    addBookmarkTab.setAttribute("id","createBookmark" + tab);
    $(addBookmarkTab).css("padding-top", "5px");

    addInputs(addBookmarkTab);
    addButtons(addBookmarkTab, tab);

    currentTab.appendChild(addBookmarkTab);
}
// function hoverOverHintSmoothness(text, div){
//     displayTextInDiv(text, div);
//     var papaDiv = div.parentNode;
//     var imgs = $(papaDiv).find("img");
//     // $(imgs[0]).css("opacity", "0.2");
//     $(imgs[0]).css("content","url(../images/plusBlack.svg");
//     $(imgs[0]).css("cursor","pointer");
//     $(imgs[0]).css("border","1px solid black");
//     $(imgs[0]).css("background-color","rgba(255,255,255,0.25)");
//
// }

// function UNDOhoverOverHintSmoothness(div){
//     purgeTextInDiv(div)
//     var papaDiv = div.parentNode;
//     var imgs = $(papaDiv).find("img");
//     // $(imgs[0]).css("opacity", "0.2");
//     $(imgs[0]).css("content","url(../images/plus.svg");
//     // $(imgs[0]).css("cursor","pointer");
//     $(imgs[0]).css("border","1px solid white");
//     $(imgs[0]).css("background-color","rgba(40,40,40,0.25)");
// }

function displayTextInDiv(text, div){
    var papaDiv = div.parentNode;
    var otherPossibleHints = papaDiv.getElementsByClassName("bookmarkTextHint");
    for (let i = 0; i < otherPossibleHints.length; i++) {
        console.log("test");
        $(otherPossibleHints[i]).remove();
    }
    var textSlot = document.createElement("p");
    textSlot.setAttribute("class", "bookmarkTextHint");
    $(textSlot).css("color", "white");
    $(textSlot).css("text-align", "center");
    $(textSlot).css("position", "absolute");
    $(textSlot).css("top", "50%");
    $(textSlot).css("left", "50%");
    $(textSlot).css("font-weight", "bold");
    $(textSlot).css("font-size", "11px");
    $(textSlot).css("user-select", "none");
    $(textSlot).css("transform", "translateX(-50%) translateY(-50%)");
    $(textSlot).css("opacity", "1");
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

    var createButton = document.createElement("button")
    createButton.setAttribute("onclick", "addBookmark("+tab+")");
    $(createButton).css("float", "right");
    createButton.innerText = "CREATE"

    addBookmarkTab.appendChild(cancelButton);
    addBookmarkTab.appendChild(createButton);
}


function addBookmark(tab){
    console.log(tab);
}