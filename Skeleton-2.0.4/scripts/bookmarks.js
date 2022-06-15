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
window.onload = function (){
    setOnHoverBookmark();
}
function setOnHoverBookmark(){
    var bookmarks = document.getElementsByClassName("bookmark container");
    for (let i = 0; i < bookmarks.length; i++) {
        $(bookmarks[i]).hover(
            function() {
                var text = document.createElement("p");
                text.setAttribute("id","bookmarkOnHoverHintText")
                text.innerHTML = "GO";
                $(text).css("position", "absolute");
                $(text).css("top", "50%");
                $(text).css("left", "50%");
                $(text).css("transform", "translate(-50%, -50%)");
                $(text).css("color", "white");
                // $(text).css("opacity", "1");
                // $(text).css("user-select", "none" );
                // var offsets = $(bookmarks[i]).offset();
                // var top = offsets.top;
                // var left = offsets.left;
                // var width = $(bookmarks[i]).width();
                // var height = $(bookmarks[i]).height();
                bookmarks[i].appendChild(text);
                // $(text).css("position", "absolute");
                // $(text).css("top", top + (height/2));
                // $(text).css("left", left + (width/2));
                // $(text).css("cursor", "pointer");
                // $(text).hover(
                //     function() {
                //         $(bookmarks[i]).css("cursor","pointer");
                //         $(bookmarks[i]).css("opacity", "0.2");
                // }
                // );
            },
            function(){
                $(document.getElementById("bookmarkOnHoverHintText")).remove();

            }
        );
    }
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