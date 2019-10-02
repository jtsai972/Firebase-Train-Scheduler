var trainName, destination, frequency, firstTime, nextArrival, minutesAway;




$("form button").on("click", function(){
    event.preventDefault();

    trainName = $("#train").val().trim();
    destination = $("#destination").val().trim();
    nextArrival = $("#time").val().trim();
    frequency = $("#frequency").val().trim();
});

function printRow() {
    var tdNew = $("<td>")

    var tRow = $("<tr>").append(
        tdNew.text(trainName),
        tdNew.text(destination),
        tdNew.text(frequency),
        tdNew.text(nextArrival),
        tdNew.text(minutesAway)
    );

    $("tbody").append(tRow);
}