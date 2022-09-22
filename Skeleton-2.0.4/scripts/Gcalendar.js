/**
 * finds calendar element and initializes it
 */
function initiateGcalendar(){
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        googleCalendarApiKey: GAPI_KEY,
        events: {
            googleCalendarId:'en.canadian#holiday@group.v.calendar.google.com'
        },
        initialView: 'dayGridMonth'
    });
    console.log(calendar);
    // calendar.render();
}