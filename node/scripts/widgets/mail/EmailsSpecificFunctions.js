async function generateEmailWindow(from, subject, date, data, messageId, accessToken, read){
    var win = window.open("", "test", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=800,height=800,screenX=600, top=110");
    var content = decodeContent(data);
    var subject = decodeContent(subject);
    var from = decodeContent(from);
    var messageIdDecoded = decodeContent(messageId);
    var accessToken = decodeContent(accessToken);
    win.document.title = subject;
    win.document.body.innerHTML = "<!DOCTYPE html><head><meta charset=\"utf-8\"></head><body><div><p>" +from +" ("+ date+")</p></div><div>"+ content+"</div></body></html>"
    if(read === 'false'){ //check if it already has the unread tag, less operations
        if(accessToken === ""){ //gapi doesn't use an accessToken so it's easy to differenciate which method to use
            response = await removeUnReadLabel(messageIdDecoded);
            console.log(response);
        } else{
            response = await outlookRead(messageIdDecoded, accessToken);
            console.log(response);
        }
        changeReadEmailCSS(messageIdDecoded);
    }
}
function eraseDivs(classname){
    $('div.' + classname).remove();
}

function decodeContent(data){
    return Base64.decode(data.replace(/-/g, '+').replace(/_/g, '/'));
}

function changeReadEmailCSS(id){
    id = removeSpecialCharacters(id);
    img = $("#" + id + " img");
    $("#" + id + " p").css("color","rgba(255, 255, 255, 0.80)");
    img.css({
        "-webkit-filter":"invert(1)",
        "filter: ":"invert(1)", //laze encompasses my being and fruitifies the most elegant of alternatives
        "background-color":"rgba(215, 215, 215, 0.15)", //if u want it black, make it white. I swear my genius frightens me

    });

    $("#" + id + " b").replaceWith(function (){ //replace all bold text with italics
        return $("<i />", {html: $(this).html()});
    });
    emailtype = getTextBetweenTwoClauses(img.attr("src"), "images/", ".svg")
    img.attr("src", "images/" + emailtype[0] + "Opened" + ".svg");
}

function getTextBetweenTwoClauses(string, clause1, clause2){
    const regex = new RegExp("(?<="+ clause1+ ")(.*)(?="+clause2+ ")");
    return (regex).exec(string);
}