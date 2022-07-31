
//Make the DIV element draggagle:
/**
 *
 * @param offsetX so the cursor is in the middle of the moveBookmarkTM button ;)
 * @param offsetY so the cursor is in the middle of the moveBookmarkTM button ;)
 * @param bookmark
 * @param evt
 */
function dragBookmark(offsetX, offsetY, bookmark, evt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  dragMouseDown(evt);
  var wait = false;// I don't wanna call elementsFromPoint too often, it must be very resource intensive
  var bookmarkToReplace = null;
  var shadow =  document.createElement("div");
  var bookmarksContainer = bookmark.parentNode;
  var margin = bookmark.style.margin;
  bookmark.style.margin = "0";
  shadow.style.margin = margin; //shenanigans for extra added soul
  shadow.className = "bookmark container shadow";
  bookmark.before(shadow); // default shadow position is 0
  bookmark.style.position = "absolute";// to move bookmark around
  document.body.appendChild(bookmark);
  document.body.style.userSelect = "none"; //disable selection while holding bookmark
  document.addEventListener("wheel", enableBookmarksContainerScrolling);//

  function enableBookmarksContainerScrolling(e){
    bookmarksContainer.scrollBy(e.deltaX, e.deltaY);
  }
  function dragMouseDown(e) {
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    bookmark.style.top = (pos4 - offsetY) + "px";
    bookmark.style.left = (pos3 - offsetX) + "px";
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }
  function checkBookmark(overlappedElement){
    return overlappedElement.id !== '' && overlappedElement.id !== bookmark.id && overlappedElement.className === 'bookmark container';//element has an id, element isn't the one moved and classname is bookmark
  }
  function elementDrag(e) {
    var location = bookmarksContainer.getBoundingClientRect();
    if(e.clientX >= location.left - 5 && e.clientX <= location.right && e.clientY >= location.top - 15  &&e.clientY <= location.bottom - 10 ){ //these may seem like arbitrary numbers, but trust me.. they're not
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      bookmark.style.top = (pos4 - offsetY) + "px";
      bookmark.style.left = ( pos3 - offsetX) + "px";
      if(!wait){
        var overlappedElements= document.elementsFromPoint(e.clientX, e.clientY);
        bookmarkToReplace = overlappedElements.find(checkBookmark);
        if(typeof bookmarkToReplace !== "undefined"){
          if($(bookmarkToReplace).is(':last-child')){
            bookmarksContainer.append(shadow);
          } else if ($(bookmarkToReplace).is(':first-child')){
            bookmarksContainer.prepend(shadow);
          } else if(Array.prototype.indexOf.call(bookmarksContainer.children, shadow)
              < Array.prototype.indexOf.call(bookmarksContainer.children, bookmarkToReplace)){ //if index of shadow is lower than index of the selected bookmark
            bookmarkToReplace.after(shadow);
          }else{
            bookmarksContainer.insertBefore( shadow, bookmarkToReplace);
          }
        }
        wait = true;
        setTimeout(function (){
          wait = false;
        },1000 / 12) //10 calls max per second
      }
    }
  }

  function closeDragElement() {
    document.removeEventListener("wheel", enableBookmarksContainerScrolling);
    /* stop moving when mouse button is released:*/
    bookmark.style.position = "relative";
    bookmark.style.top = "auto";
    bookmark.style.left = "auto";
    if(document.body.contains(shadow)){ //if div has been placed in the dom
      bookmarksContainer.insertBefore( bookmark, shadow);
      shadow.remove();
    }
    // bookmarkToInfiltrate.parentNode.insertBefore( elmnt, bookmarkToInfiltrate);
    document.onmouseup = null;
    document.onmousemove = null;
    bookmarksContainer.style.height= "auto";
    document.body.style.userSelect = "auto";
    bookmark.style.margin = margin;
    moveBookmarkToIndex(bookmark.id, Array.prototype.indexOf.call(bookmarksContainer.children, bookmark),
        bookmarksContainer.parentNode.id);
  }
}
