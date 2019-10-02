//Info pulled from form
var trainName, destination, frequency, startTime;
//values calculated in calculateTime function
var startTimeConverted, timeDifference, minutesAway, nextArrival;




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
        $("<td>").text(frequency),
        $("<td class='nextTime'>").text(nextArrival),
        $("<td class='minAway'>").text(minutesAway)
    );

    $("tbody").append(tRow);
}