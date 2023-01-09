class BookmarksDB{
    /**
     * Fetch bookmarks of tab from internal storage and appends it to the page.
     * @param tab
     */
    refreshBookmarks(tab) {
        var bookmarkList = [];
        if (!localStorage.getItem("bookmarks" + tab)) { //if there's no bookmark add the default widget
            localStorage.setItem("index" + tab, 1); // index always one ahead
            bookmarkList.push(new Bookmark("Add" + tab, "", "", "", tab));// add
            localStorage.setItem("bookmarks" + tab, JSON.stringify(bookmarkList));
        } else {
            bookmarkList = JSON.parse(localStorage.getItem("bookmarks" + tab));
            var bookmarksContainer = getTabById(tab).getElementsByClassName("bookmarks container");
            $(bookmarksContainer).empty();// man... jquery is funny
        }
        displayBookmarks(bookmarkList, tab)
    }
}