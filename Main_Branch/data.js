$(document).ready(function() {
    //var csv is the CSV file with headers
    function csvJSON(csv) {

        var lines = csv.split("Resources/covid19_vaccinations_in_the_united_states.csv");

        var result = [];

        var headers = lines[0].split(",");

        for (var i = 1; i < lines.length; i++) {

            var obj = {};
            var currentline = lines[i].split(",");

            for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
            }

            result.push(obj);

        }

        //return result; //JavaScript object
        return JSON.stringify(result); //JSON
    }
});