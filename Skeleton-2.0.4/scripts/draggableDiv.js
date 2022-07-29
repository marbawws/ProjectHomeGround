
//Make the DIV element draggagle:

function dragBookmark(offsetx, offsety, bookmark, evt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  dragMouseDown(evt);
  var wait = false;// I don't wanna call elementsFromPoint too often, it must be very resource intensive
  var bookmarkToReplace;
  var shadow =  document.createElement("div");
  shadow.className = "bookmark container shadow";
  bookmark.before(shadow);
  bookmark.style.position = "absolute";
  document.body.appendChild(bookmark);

  function enableBookmarksContainerScrolling(e){
    // e.preventDefault();
    bookmark.parentNode.scrollBy(e.deltaX, e.deltaY);
  }
  function dragMouseDown(e) {
    // e = e || window.event;
    // e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    bookmark.style.top = (pos4 - offsety) + "px";
    bookmark.style.left = (pos3 - offsetx) + "px";
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
    document.addEventListener("wheel", enableBookmarksContainerScrolling);
  }
  function checkBookmark(overlappedElement){
    return overlappedElement.id !== '' && overlappedElement.id !== bookmark.id && overlappedElement.className === 'bookmark container';//element has an id, element isn't the one moved and classname is bookmark
  }
  function elementDrag(e) {
    if(e.clientX >= (91 - 50) && e.clientX <= 432 && e.clientY >= 78 &&e.clientY <= (240 + 50) ){ //these may seem like arbitrary numbers, but trust me.. they're not
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      bookmark.style.top = (pos4 - offsety) + "px";
      bookmark.style.left = ( pos3 - offsetx) + "px";
      if(!wait){
        var overlappedElements= document.elementsFromPoint(e.clientX, e.clientY);
        bookmarkToReplace = overlappedElements.find(checkBookmark);
        if(typeof bookmarkToReplace !== "undefined"){
          if($(bookmarkToReplace).is(':last-child')){
            bookmarkToReplace.parentNode.append(shadow);
          } else if ($(bookmarkToReplace).is(':first-child')){
            bookmarkToReplace.parentNode.prepend(shadow);
          } else if(shadow.nextElementSibling === bookmarkToReplace){
            bookmarkToReplace.after(shadow);
          }else{
            bookmarkToReplace.parentNode.insertBefore( shadow, bookmarkToReplace);
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
      shadow.parentNode.insertBefore( bookmark, shadow);
      shadow.remove();
    }
    // bookmarkToInfiltrate.parentNode.insertBefore( elmnt, bookmarkToInfiltrate);
    document.onmouseup = null;
    document.onmousemove = null;
    bookmark.parentNode.style.height= "auto";
  }
}
