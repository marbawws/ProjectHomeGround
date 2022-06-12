// var index = 0;
async function generateEmailWindow(from, subject, date, data, messageId, accessToken){
    var win = window.open("", "test", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=800,height=800,screenX=600, top=110");
    var content = decodeContent(data);
    var subject = decodeContent(subject);
    var from = decodeContent(from);
    var messageIdDecoded = decodeContent(messageId);
    var accessToken = decodeContent(accessToken);
    win.document.title = subject;
    win.document.body.innerHTML = "<!DOCTYPE html><head><meta charset=\"utf-8\"></head><body><div><p>" +from +" ("+ date+")</p></div><div>"+ content+"</div></body></html>"

    if(accessToken === ""){ //gapi doesn't use an accessToken so it's easy to differenciate which method to use
        response = await removeUnReadLabel(messageIdDecoded);
        console.log(response);
    } else{
        response = await outlookRead(messageIdDecoded, accessToken);
        console.log(response);
    }
    changeReadEmailCSS(messageIdDecoded);
}
function eraseDivs(classname){
    $('div.' + classname).remove();
    console.log();
}

function decodeContent(data){
    return Base64.decode(data.replace(/-/g, '+').replace(/_/g, '/'));
}

function changeReadEmailCSS(id){
    console.log(id);
    id = removeSpecialCharacters(id);
    $("#" + id + " p").css("color","rgba(255, 255, 255, 0.80)");
    $("#" + id + " img").css("opacity","0.50");
    $("#" + id + " b").replaceWith(function (){
        return $("<i />", {html: $(this).html()});
    });
}