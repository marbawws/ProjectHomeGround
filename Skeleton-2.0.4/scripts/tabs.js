var gmailFetched = false;
var outlookSchoolFetched = false;
var outlookPersonalFetched = false;

var tab1Fetched = false;
var tab2Fetched = false;
var tab3Fetched = false;

window.onload = function() {

};
    function openTab(evt, tabName) {
      var i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName("tabcontentBookmark");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      tablinks = document.getElementsByClassName("tablinksBookmark");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
      }
      document.getElementById(tabName).style.display = "block";
      evt.currentTarget.className += " active";

      switch (tabName){
          case 'tab1':
              tab1Fetched = verifyAndRefresh(tab1Fetched, tabName);
              break;
          case 'tab2':
              tab2Fetched = verifyAndRefresh(tab2Fetched, tabName);
              break;
          case 'tab3':
              tab3Fetched = verifyAndRefresh(tab3Fetched, tabName);
              break;
      }
    }
    function verifyAndRefresh(tabFetched, tabName){
        if(!tabFetched){
            tabFetched = true;
            refreshBookmarks(tabName);
        }
        return tabFetched;
    }
    function openTabEmail(evt, tabName, type) {
      var i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName("tabcontentEmail");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      tablinks = document.getElementsByClassName("tablinksEmail");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
      }
      document.getElementById(tabName).style.display = "block";
      evt.currentTarget.className += " active";
      switch (type) {
          case 'gmail':
              if(!gmailFetched){
                  gmailFetched = true;
                  handleClientLoad(); //initate client and fetch gmail mails
              }
              break;
          case 'outlookSchool':
              if(!outlookSchoolFetched){
                  outlookSchoolFetched = true;
                  initOClient(SCHOOL_USERNAME); //initate client and fetch outlook school mails
              }
              break;
          case 'outlookPerso':
              if(!outlookPersonalFetched){
                  outlookPersonalFetched = true;
                  initOClient(PERSONAL_USERNAME); //initate client and fetch outlook perso mails
              }
              break;
      }
    }