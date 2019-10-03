//Info pulled from form
var trainName, destination, frequency, startTime;
//values calculated in calculateTime function
var startTimeConverted, timeDifference, minutesAway, nextArrival;
//timer to update site every minute
var minuteTimer, isTimed = false;




$("form button").on("click", function(){
    //preventing button from refreshing page
    event.preventDefault();

    //setting values from form
    trainName = $("#train").val().trim();
    destination = $("#destination").val().trim();
    startTime = $("#time").val().trim();
    frequency = $("#frequency").val().trim();

    console.log("Start time: " + startTime);
    console.log("Frequency: " + frequency);
    
    //setting up some functions to calculate and print results
    calculateTime();
    printRow();

    $("form").trigger("reset");

    if(isTimed === false) {
        timer()
    }
    isTimed = true;
});

//calculate time stuff
function calculateTime() {
    //Moment.js stuff
    //getting the start time and setting it to a moment object
    startTimeConverted = moment(startTime, "HH:mm");
    console.log("Converted start time: " + startTimeConverted);

    //current time minus startTime
    timeDifference = moment().diff(startTimeConverted, "minutes");
    console.log("Minutes since train started: " + timeDifference);

    //how many minutes left before the next train
    minutesAway = timeDifference % frequency;
    console.log("Minutes until next train: " + minutesAway);

    //Time for next arrival of the train
    nextArrival = moment().add(minutesAway, "minutes").format("HH:mm");
    console.log("Train will next arrive at: " + nextArrival);
}

function printRow() {
    var tRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td class='frequency'>").text(frequency),
        $("<td class='nextTime'>").text(nextArrival),
        $("<td class='minAway'>").text(minutesAway)
    );

    $("tbody").append(tRow);
}

function timer() {
    minuteTimer = setInterval( function(){

        //subtracting minutes from minutesAway
        $(".minAway").each( function() {
            var textMin = $(this).text();
            var freq = $(this).parent().find(".frequency").text();

            //console.log("Minutes left: " + textMin);
            //console.log("Frequency text: " + freq);

            textMin--;

            if(textMin === -1) {
                $(this).text(freq);

                //add new train arrival time
                var next = $(this).parent().find(".nextTime");
                //console.log("Next: " + next.text());

                var nextConverted = moment(next.text(), "HH:mm");
                //console.log("Next converted: " + nextConverted);

                var newTime = nextConverted.add(freq, "m");
                //console.log("new arrival time: " + newTime.format("HH:mm"));

                next.text(newTime.format("HH:mm"));
            } else {
                $(this).text(textMin);
            };
        });

    }, (60 * 1000));
}

/* Thoughts
    console.log($(this));

    var text = $(this).text();
    console.log("Text: " + text);

    var time = moment(text, "HH:mm");
    console.log("Time: " + time);

    $(this).text((time.subtract(1, "minutes")).format("HH:mm"));

    if($(this).text() === "0") {
        $(this).text($(this).parent().find(".frequency")) ;
    }
            */