/**
 * finds calendar element and initializes it
 */


function inquireCalendarInformation() { //https://stackoverflow.com/questions/28242742/fullcalendar-with-private-google-calendar-event why bother, wheel's been invented kid

    // Step 4: Load the Google+ API
    // gapi.load('calendar', 'v3').then(function () {
        // Step 5: Assemble the API request
    var colorRequest = gapi.client.calendar.colors.get({

    })
    colorRequest.then(function(response){
        return response.result.event;
    }).then(function(colorsMapping){
        var request = gapi.client.calendar.events.list({
            'calendarId': 'maladin.rezgui@gmail.com',
            "maxResults":"2500"
        });

        // Step 6: Execute the API request
        request.then(function (response) {

            var eventsList = [];

            if (response.result.error) {
                reportError('Google Calendar API: ' + data.error.message, data.error.errors);
            } else if (response.result.items) {
                $.each(response.result.items, function (i, entry) {
                    // console.log(entry);
                    var url = entry.htmlLink;
                    var color = "rgb(55,136,216)";

                    // make the URLs for each event show times in the correct timezone
                    //if (timezoneArg) {
                    //    url = injectQsComponent(url, 'ctz=' + timezoneArg);
                    //}
                    if(entry.colorId != null){
                        //cross reference like a pro
                        color = colorsMapping[entry.colorId].background;
                    }
                    eventsList.push({
                        id: entry.id,
                        title: entry.summary,
                        start: entry.start.dateTime || entry.start.date, // try timed. will fall back to all-day
                        end: entry.end.dateTime || entry.end.date, // same
                        url: url,
                        location: entry.location,
                        backgroundColor: color,
                    });
                });
                // call the success handler(s) and allow it to return a new events array
                // successArgs = [eventsList].concat(Array.prototype.slice.call(arguments, 1)); // forward other jq args
                // successRes = $.fullCalendar.applyAll(true, this, successArgs);
                // if ($.isArray(successRes)) {
                //     return successRes;
                // }
            }
            // console.log(eventsList);
            if (eventsList.length > 0) {
                // Here create your calendar but the events options is :
                //fullcalendar.events: eventsList (Still looking for a methode that remove current event and fill with those news event without recreating the calendar.
                var calendarEl = document.getElementById('calendar');
                var calendar = new FullCalendar.Calendar(calendarEl, {
                    // googleCalendarApiKey: GAPI_KEY,
                    events: eventsList,
                    initialView: 'timeGridWeek',
                    eventDisplay:'block',
                    allDaySlot: false,
                    slotMinTime: "08:00:00",
                    slotMaxTime: "22:00:00",
                    height: '100%',
                    expandRows: true,
                    slotDuration: "01:00:00",
                    eventDidMount: function(info) {
                        info.el.title = info.event.title;
                    }
                });
                // console.log(calendar);
                calendar.render();
            }
            return eventsList;

        }, function (reason) {
            console.log('Error: ' + reason.result.error.message);
        })
    });
    // });
}