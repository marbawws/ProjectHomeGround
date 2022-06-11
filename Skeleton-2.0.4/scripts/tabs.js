var gmailFetched = false;
var outlookSchoolFetched = false;
var outlookPersonalFetched = false;

    function openTab(evt, tabName) {
      var i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName("tabcontent");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      tablinks = document.getElementsByClassName("tablinks");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
      }
      document.getElementById(tabName).style.display = "block";
      evt.currentTarget.className += " active";
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
                  handleClientLoad(); //initate client and fetch gmail mails
                  gmailFetched = true;
              }
              break;
          case 'outlookSchool':
              if(!outlookSchoolFetched){
                  initOClient(SCHOOL_USERNAME); //initate client and fetch outlook school mails
                  outlookSchoolFetched = true;
              }
              break;
          case 'outlookPerso':
              if(!outlookPersonalFetched){
                  initOClient(PERSONAL_USERNAME); //initate client and fetch outlook perso mails
                  outlookPersonalFetched = true;
              }
              break;
      }
    }