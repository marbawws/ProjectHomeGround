class NotificationDOM {
    get domElement() {
        return this._domElement;
    }

    set domElement(value) {
        this._domElement = value;
    }
    get information() {
        return this._information;
    }

    set information(value) {
        this._information = value;
    }

    constructor(_information) {

        this._information = _information;
    }

    generateDomElement(){
        var domElement = document.createElement("div");
        domElement.setAttribute("class", "Notification container");

        var information = document.createElement("p");
        information.setAttribute("class", "Notification");
        information.appendChild(document.createTextNode(this._information));

        var dismiss = document.createElement("button");
        dismiss.innerText = "DISMISS";
        dismiss.setAttribute("class", "Notification");
        dismiss.setAttribute("float", "left");
        var thisButCooler = this; //or literallyThis whichever you prefer really
        dismiss.onclick = function() {thisButCooler.dismissed()};

        // $(notificationDiv).css("width", "100%");
        // notificationDiv.setAttribute("class", "container");
        domElement.appendChild(information);
        domElement.appendChild(dismiss);

        this.domElement = domElement;
    }
    deleteDomElement(){
        $(this.domElement).remove();
    }
    dismissed(){
        this.deleteDomElement();
    }
}
function deleteNotificationDom(Notification){
    if (Notification.isins){}
}
class TimedNotification extends NotificationDOM{
    get domElement() {
        return super.domElement;
    }

    set domElement(value) {
        super.domElement = value;
    }
    intervalEnd(scope){
        if(scope.progress > 0){
            scope.timerBarProgressed(scope);
        } else{ //end of timer
            scope.dismissed(scope.timer, scope.methodToCallString);
        }
    }
    endTimer(timer, method){
        clearInterval(timer);
        try {
            eval(method);
        }catch (e) {
            console.log('END OF TIMER : nothing to call...');
        }
    }
    timerBarProgressed(scope){
        var notification = scope.domElement;
        var progressBar = (notification.getElementsByClassName("progressBar"))[0];
        var currentWidth = scope.progress.toString();
        var firstPart = currentWidth.substring(0, currentWidth.length - 1);
        var secondPart = currentWidth.substring(currentWidth.length - 1, currentWidth.length);

        currentWidth = firstPart + "." + secondPart;
        $(progressBar).css("width", currentWidth + "%");
        console.log(scope.progress);
        console.log(currentWidth);
        scope.progress = scope.progress - 1 ;
    }
    get methodToCallString(){
        return this._methodToCallString;
    }
    set methodToCallString(value){
        this._methodToCallString = value;
    }

    /**
     *
     * @param methodToCallString If you wish to execute somthing after the timer ends
     */
    startTimer(methodToCallString){
        this.methodToCallString = methodToCallString;
        this.progress = 1000;
        this.timer = window.setInterval( this.intervalEnd, this.duration / 1000, this)
    }

    dismissed() {
        super.dismissed();
        this.endTimer(this.timer, this.methodToCallString);
    }


    deleteDomElement() {
        super.deleteDomElement();
        console.log("deletion");
    }

    generateDomElement() {
        super.generateDomElement();
        var progressBarContainer = document.createElement("div");
        var progressBar = document.createElement("div");

        progressBarContainer.setAttribute("class", "progressBarContainer container");
        progressBar.setAttribute("class", "progressBar");

        progressBarContainer.appendChild(progressBar);
        (this.domElement).appendChild(progressBarContainer);
    }
    get progress(){
        return this._progress;
    }
    set progress(value){
        this._progress = value;
    }
    get timer(){
        return this._timer;
    }
    set timer(value){
        this._timer = value;
    }

    get duration() {
        return this._duration;
    }

    set duration(value) {
        this._duration = value;
    }

    get information() {
        return super.information;
    }

    set information(value) {
        super.information = value;
    }

    /**
     *
     * @param information STRING
     * @param duration NUMBER, min is like 3 seconds, might actually make it go lower with better code one day. MILLISECONDS BTW
     */
    constructor(information, duration) {
        super(information);
        this._duration = duration;
    }
}
class TimedBookmarkDeletedNotification extends TimedNotification{
    get bookmarkDOM() {
        return this._bookmarkDOM;
    }

    set bookmarkDOM(value) {
        this._bookmarkDOM = value;
    }

    // intervalEnd(scope) {
    //     if(scope.progress > 0){
    //         scope.timerBarProgressed(scope.domElement, scope.progress);
    //     } else{ //end of timer
    //         clearInterval(scope.timer);
    //         scope.deleteDomElement();
    //     }
    // }
    unHideBookmark(){
        $(this.bookmarkDOM).css("display","block");
    }

    constructor(information, duration, bookmarkDOM) {
        super(information, duration);
        this._bookmarkDOM = bookmarkDOM;
    }

    generateDomElement() {
        super.generateDomElement();
        var undoButton = document.createElement("button");
        undoButton.innerText="UNDO"
        var thisButCooler = this;
        undoButton.onclick = function() {
            $(thisButCooler._bookmarkDOM).css("display","block");
            thisButCooler.unHideBookmark();
            thisButCooler.methodToCallString = "bookmarkSavedFromDeletion("+ thisButCooler._bookmarkDOM.id +")"; //could become something in the future, for now insure it doesnt call deletion, nvm found somrhinf
            thisButCooler.dismissed();
        };
        undoButton.setAttribute("class", "Notification");
        undoButton.setAttribute("float", "right");
        $(undoButton).css("margin-left", "46%");
        var progressBar = (this.domElement).getElementsByClassName("progressBarContainer container")[0];
        (this.domElement).insertBefore(undoButton, progressBar);
        // (this.domElement).appendChild(undoButton);
    }
}
class ImageNotification extends NotificationDOM{
    get domElement() {
        return super.domElement;
    }

    set domElement(value) {
        super.domElement = value;
    }

    generateDomElement() {
        super.generateDomElement();
    }
    get imageSrc() {
        return this._imageSrc;
    }

    set imageSrc(value) {
        this._imageSrc = value;
    }

    get information() {
        return super.information;
    }

    set information(value) {
        super.information = value;
    }

    constructor(information, imageSrc) {
        super(information);
        this._imageSrc = imageSrc;
    }

}
class ImageTimedNotification extends ImageNotification  {
    get duration() {
        return this._duration;
    }

    set duration(value) {
        this._duration = value;
    }


    get information() {
        return super.information;
    }

    set information(value) {
        super.information = value;
    }


    get domElement() {
        return super.domElement;
    }

    set domElement(value) {
        super.domElement = value;
    }

    generateDomElement() {
        super.generateDomElement();
    }

    get imageSrc() {
        return this._imageSrc;
    }

    set imageSrc(value) {
        this._imageSrc = value;
    }

    constructor(information, imageSrc, duration) {
        super(information, imageSrc);
        this._duration = duration;
        this._imageSrc = imageSrc;
    }
}


