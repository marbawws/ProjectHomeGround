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

        var undo = document.createElement("button");
        undo.innerText = "UNDO";
        $(undo).css("float", "right");
        undo.setAttribute("class", "Notification");

        domElement.appendChild(information);
        domElement.appendChild(dismiss);
        domElement.appendChild(undo);
        this.domElement = domElement;
    }
    deleteDomElement(){
        $(this.domElement).remove();
    }
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
        } else{ //end of timer
            clearInterval(scope.timer);
            scope.deleteDomElement();
        }
    }
    startTimer(){
        this.progress = 1000;
        this.timer = window.setInterval( this.intervalEnd, this.duration / 1000, this)
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
     * @param duration NUMBER
     */
    constructor(information, duration) {
        super(information);
        this._duration = duration;
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


