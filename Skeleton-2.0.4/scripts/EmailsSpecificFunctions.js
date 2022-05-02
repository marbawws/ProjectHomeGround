var index = 0;
function generateEmailWindow(from, subject, emailText){
    $("<div id='emailContainer"+ index +"' class='emailContainers container' style='margin: 0; padding: 0;border-radius: 0px'>"+
    "<div id='emailContainer"+ index +"header' class='emailContainerheaders container' style='margin: 0; padding: 0; width:100%;border-radius: 0px'>" + "<p class='gmail'>" +from +"</p>"+
    "</div><p class='gmail'>"+subject+"</p></div>").appendTo("body");
    makeDraggable(document.getElementById("emailContainer" + index));
    index ++;
}