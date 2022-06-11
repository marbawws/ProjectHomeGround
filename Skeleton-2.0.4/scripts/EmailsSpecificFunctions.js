// var index = 0;
function generateEmailWindow(from, subject, date, data){
    var win = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,top="+(screen.height-400)+",left="+(screen.width-840));
    var content = decodeContent(data);
    var subject = decodeContent(subject);
    var from = decodeContent(from);
    win.document.body.innerHTML = "<!DOCTYPE html><head><meta charset=\"utf-8\"></head><body><div><p>" +from +" ("+ date+")</p></div><div>" + subject+ "</div><div>"+ content+"</div></body></html>"
}

