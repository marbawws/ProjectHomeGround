// var index = 0;
function generateEmailWindow(from, subject, date, data){
    var win = window.open("", "test", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=800,height=800,screenX=600, top=110");
    var content = decodeContent(data);
    var subject = decodeContent(subject);
    var from = decodeContent(from);
    win.document.title = subject;
    win.document.body.innerHTML = "<!DOCTYPE html><head><meta charset=\"utf-8\"></head><body><div><p>" +from +" ("+ date+")</p></div><div>"+ content+"</div></body></html>"
}
function eraseDivs(classname){
    $('div.' + classname).remove();
    console.log();
}
