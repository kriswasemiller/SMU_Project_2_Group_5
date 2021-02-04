$(document).ready(function() {
    makeMap();
});

//this function is going to grab the data needed for the map
function makeMap() {
    var queryUrl = "https://covid.ourworldindata.org/data/owid-covid-data.json"

    // Perform a GET request to the query URL
    $.ajax({
        type: "GET",
        url: queryUrl,
        success: function(data) {
            console.log(data);

            // buildMap(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus);
            alert("Error: " + errorThrown);
        }
    });
}