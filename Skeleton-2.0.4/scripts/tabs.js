var gmailFetched = false;
var outlookSchoolFetched = false;
var outlookPersonalFetched = false;
var waitForPage = true;

    window.onload = function() {
        // var tablinks = document.getElementsByClassName("tablinksBookmark");
        // var tabcontent = document.getElementsByClassName("tabcontentBookmark");
        // openTab(tabcontent[0],tablinks[0])
        refreshBookmarks("tab1");
    };
    function openTab(tab, button) {

      var i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName("tabcontentBookmark");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      tablinks = document.getElementsByClassName("tablinksBookmark");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
      }
      tab.style.display = "block";
      button.className += " active";
      if(tab.classList.contains("fetched")){
        console.log("tab already fetched");
      } else{
        refreshBookmarks(tab.id);
        tab.className += " fetched";
      }
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