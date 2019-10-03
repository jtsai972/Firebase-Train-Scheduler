//Database
var config = {
    apiKey: "AIzaSyCGLo6YNDxMpesuapo0S00z9B5Na7x5Qvg",
    authDomain: "fir-project-25203.firebaseapp.com",
    databaseURL: "https://fir-project-25203.firebaseio.com",
    projectId: "fir-project-25203",
    storageBucket: "fir-project-25203.appspot.com",
    messagingSenderId: "683229760472",
    appId: "1:683229760472:web:4ff3016f898a5345c0c0ad",
    measurementId: "G-9PJ6STEY6C"
};
firebase.initializeApp(config);

var database = firebase.database();

//Info pulled from form
var trainName, destination, frequency, startTime;
//values calculated in calculateTime function
var startTimeConverted, timeDifference, minutesAway, nextArrival;
//timer to update site every minute
var minuteTimer, isTimed = false;

/* ================================================
 * Database content
 * ================================================= */
// When something is added to the child
database.ref("/trainData").on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
    
    trainName = childSnapshot.val().trainName;
    destination = childSnapshot.val().destination;
    frequency = childSnapshot.val().frequency;
    startTime = childSnapshot.val().startTime;
    minutesAway = childSnapshot.val().minutesAway;
    nextArrival = childSnapshot.val().nextArrival;

    console.log(childSnapshot.val().destination);
    
    printRow();
    timer();//start timer
});
//changes the data with the element
database.ref("/trainData").on("value", function(snapshot){
    let rowNum = 0;
    snapshot.forEach(function(data){
        //getting the tr in the tbody
        var rowName = $($("tbody tr")[rowNum]);

        snapshot.val().nextArrival = rowName.find("nextTime").text();
        snapshot.val().minutesAway = rowName.find(".minAway").text();
        
        rowNum++; //incrementing each loop
        console.log(rowNum);
    });
});



/* ================================================
 * Document events
 * ================================================= */
$("form button").on("click", function(){
    //preventing button from refreshing page
    event.preventDefault();

    //setting values from form
    trainName = $("#train").val().trim();
    destination = $("#destination").val().trim();
    startTime = $("#time").val().trim();
    frequency = parseInt($("#frequency").val().trim());

    console.log("Start time: " + startTime);
    console.log("Frequency: " + frequency);
    
    //setting up some functions to calculate and print results
    calculateTime();

    var newTrain = {
        trainName: trainName,
        destination: destination,
        startTime: startTime,
        frequency: frequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway
    }
    //adding new train item to trainData
    database.ref("/trainData").push(newTrain);

    $("form").trigger("reset");

    //making sure the timer is only called once
    if(isTimed === false) { timer() };
    isTimed = true;
});

/* ================================================
 * Functions
 * ================================================= */

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
    clearInterval(minuteTimer);
    minuteTimer = setInterval( function(){
        console.log("timer is on");

        //subtracting minutes from minutesAway
        $(".minutesAway").each( function() {
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

    }, (6 * 1000));
}

//clear interval on page close
$(document).on('close', '[data-reveal]', function () {
    isTimed = false;
    clearInterval(minuteTimer);
});