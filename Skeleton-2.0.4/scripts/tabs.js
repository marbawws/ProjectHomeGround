// var gmailFetched = false;
// var outlookSchoolFetched = false;
// var outlookPersonalFetched = false;
// var waitForPage = true;

    window.onload = function() {

        refreshBookmarks("tab1");
        initiateGcalendar();
    };
    function openTab(tabObject, button) {

      var i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName("tabcontentBookmark");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      tablinks = document.getElementsByClassName("tablinksBookmark");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
      }
      tabObject.style.display = "block";
      button.className += " active";
      if(tabObject.classList.contains("fetched")){
        console.log("tab already fetched");
      } else{
        refreshBookmarks(tabObject.id);
        tabObject.className += " fetched";
      }
    }
    function openTabEmail(tabObject, button, type) { //type will be removed at some point
      var i, tabContent, tabLinks;
      tabContent = document.getElementsByClassName("tabcontentEmail"); //hide all content tabs
      for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
      }
      tabLinks = document.getElementsByClassName("tablinksEmail"); // remove "active" classname
      for (i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
      }
      tabObject.style.display = "block"; // show content tab from parameter
        button.className += " active";
        if(tabObject.classList.contains("fetched")){
            console.log("tab already fetched");
        } else{
            switch (type) {
                case 'professional':
                    handleClientLoad(); //initate client and fetch gmail mails
                    break;
                case 'school':
                    initOClient(SCHOOL_USERNAME); //initate client and fetch outlook school mails
                    break;
                case 'personal':
                    initOClient(PERSONAL_USERNAME); //initate client and fetch outlook perso mails
                    break;
            }
            tabObject.className += " fetched";
        }
    }