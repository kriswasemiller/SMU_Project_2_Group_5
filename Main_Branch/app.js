$(document).ready(function() {
    makeMap();

    //event listener
    $(window).resize(function() {
        // makePlot();

        $('#myTable').DataTable();
    });
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

    // function makePlot() {
    d3.csv("Resources/covid19_vaccinations_in_the_united_states.csv").then(function(data2) {
                console.log(data2);


                // STEP 1: SET UP THE CANVAS
                $("#scatter").empty();

                // var svgWidth = 960;
                var svgWidth = 1300;
                var svgHeight = 500;

                var margin = {
                    top: 20,
                    right: 40,
                    bottom: 60,
                    left: 80
                };
                var chart_width = svgWidth - margin.left - margin.right;
                var chart_height = svgHeight - margin.top - margin.bottom;

                // STEP 2: create SVG
                var svg = d3.select("#scatter")
                    .append("svg")
                    .attr("width", svgWidth)
                    .attr("height", svgHeight)
                    .classed("chart", true);

                var chartGroup = svg.append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`);
                // STEP 3: prepare data
                data2.forEach(function(row) {
                    row.Total_Delivered = +row.Total_Delivered;
                    row.Total_Administered = +row.Total_Administered;
                });
                // STEP 4: Create Scales
                var xScale = d3.scaleLinear()
                    .domain(d3.extent(data2, d => d.Total_Delivered))
                    .range([0, chart_width]);

                var yScale = d3.scaleLinear()
                    .domain(d3.extent(data2, d => d.Total_Administered))
                    .range([chart_height, 0]);

                // STEP 5: create axes
                var leftAxis = d3.axisLeft(yScale);
                var bottomAxis = d3.axisBottom(xScale);

                chartGroup.append("g")
                    .attr("transform", `translate(0, ${chart_height})`)
                    .call(bottomAxis);

                chartGroup.append("g")
                    .call(leftAxis);

                // create state text
                var textGroup = chartGroup.append("g")
                    .selectAll("text")
                    .data(data2)
                    .enter()
                    .append("text")
                    .text(d => d.abbr)
                    .attr("alignment-baseline", "central")
                    .attr("x", d => xScale(d.Total_Delivered))
                    .attr("y", d => yScale(d.Total_Administered))
                    .attr("font-size", 12)

                // STEP 6: create graph and append circles
                var circlesGroup = chartGroup.append("g")
                    .selectAll("circle")
                    .data(data2)
                    .enter()
                    .append("circle")
                    // .filter(function(d) { return d.close < 0 })
                    .attr("cx", d => xScale(d.Total_Delivered))
                    .attr("cy", d => yScale(d.Total_Administered))
                    .attr("r", "15")
                    .attr("fill", "purple")
                    .attr("stroke-width", "1")
                    .attr("stroke", "navy")
                    .style("opacity", 0.25);

                // STEP 7: assign axes
                chartGroup.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0 - margin.left + 0)
                    .attr("x", 0 - (chart_height / 1.5))
                    .attr("dy", "1em")
                    .attr("class", "axisText")
                    .text("Total Administered");

                chartGroup.append("text")
                    .attr("transform", `translate(${chart_width / 2}, ${chart_height + margin.top + 30})`)
                    .attr("class", "axisText")
                    .text("Total Delivered");

                // STEP 8: create tooltip 
                // Step 1: Initialize Tooltip
                var toolTip = d3.tip()
                    .attr("class", "d3-tip")
                    .offset([150, -60])
                    .html(function(d) {
                        return (`<strong>${d.State_Territory_Federal_Entity}<strong><hr><strong>Total Delivered: ${d.Total_Delivered}, Total Administered: ${d.Total_Administered}</strong>`);
                    });

                // Step 2: Create the tooltip in chartGroup.
                circlesGroup.call(toolTip);

                // Step 3: Create "mouseover" event listener to display tooltip
                circlesGroup.on("mouseover", function(event, d) {
                        toolTip.show(d, this);

                        //make bubbles big
                        d3.select(this)
                            .transition()
                            .duration(1000)
                            .attr("r", 40);
                    })
                    // Step 4: Create "mouseout" event listener to hide tooltip
                    .on("mouseout", function(event, d) {
                        toolTip.hide(d);

                        d3.select(this)
                            .transition()
                            .duration(1000)
                            .attr("r", 15);
                    });

                function doWork() {
                    d3.csv("assets/data/COVID_LOLLYPOP.csv").then(function(data_covid) {
                        // 3) prepare data
                        data_covid.forEach(function(row) {
                            row.tot_cases = +row.tot_cases;
                            row.state = row.state;
                        });
                        // console.log(data_covid);

                        // 1): canvas set up
                        $("#scatter").empty();

                        var svg_width = window.innerWidth;
                        var svg_height = 500;

                        var margin = {
                            top: 30,
                            right: 40,
                            bottom: 60,
                            left: 80
                        };

                        var chartWidth = svg_width - margin.left - margin.right;
                        var chartHeight = svg_height - margin.top - margin.bottom;

                        // 2) create svg if it doesnt exist

                        // Create svg wrapper, append SVG grp, and shift svg grp by left and top margins.
                        var svg = d3.select("#scatter")
                            .append("svg")
                            .attr("width", svg_width)
                            .attr("height", svg_height)
                            .classed("chart", true);

                        var chartGroup = svg.append("g")
                            .attr("transform", `translate(${margin.left}, ${margin.top})`);

                        data_covid = data_covid.sort((a, b) => b.tot_cases - a.tot_cases);

                        // 4) create scales
                        var xScale = d3.scaleBand()
                            .domain(data_covid.map(d => d.state))
                            .range([0, chartWidth]);

                        var yScale = d3.scaleLinear()
                            .domain(d3.extent(data_covid, d => d.tot_cases))
                            .range([chartHeight, 0]);

                        // 5) create axes
                        var left_axis = d3.axisLeft(yScale);
                        var bottom_axis = d3.axisBottom(xScale);

                        chartGroup.append("g")
                            .attr("transform", `translate(0, ${chartHeight})`)
                            .call(bottom_axis);

                        chartGroup.append("g")
                            .call(left_axis);

                        // 5.5) text in cirlces
                        var textGrp = chartGroup.append("g").selectAll("text")
                            .data(data_covid)
                            .enter()
                            .append("text")
                            .text(d => d.abbr)
                            .attr("x", d => xScale(d.state))
                            .attr("y", d => yScale(d.tot_cases))
                            .attr("font-size", 15)
                            .classed("stateText", true);


                        // 6) create graph
                        // append circles
                        var circlesGrp = chartGroup.append("g")
                            .selectAll("circle")
                            .data(data_covid)
                            .enter()
                            .append("circle")
                            .attr("cx", d => xScale(d.state))
                            .attr("cy", d => yScale(d.tot_cases))
                            .attr("r", "18")
                            .style("opacity", 0.5)
                            .attr("fill", "blue")
                            .attr("stroke", "black")
                            .attr("stroke-width", "1")
                            .classed("stateCircle", true);

                        // Lines
                        var lineGrp = chartGroup.append("g")
                            .selectAll("line")
                            .data(data_covid)
                            .enter()
                            .append("line")
                            .attr("x1", d => xScale(d.state))
                            .attr("x2", d => xScale(d.state))
                            .attr("y1", d => yScale(d.tot_cases))
                            .attr("y2", yScale(0))
                            .attr("stroke", "grey")

                        // make cirlces zoom in and out w text 
                        // 5a) Initialize Tooltip
                        var toolTip = d3.tip()
                            .attr("class", "d3-tip")
                            .offset([180, -60])
                            .html(function(d) {
                                return (`<strong>State: <strong>${d.state}<strong><hr><strong>Total Cases: ${d.tot_cases}`);
                            });

                        // 5b) Create the tooltip in chartGroup.
                        circlesGrp.call(toolTip);

                        // 5c) Create "mouseover" event listener to display tooltip
                        circlesGrp.on("mouseover", function(event, d) {
                                toolTip.show(d, this);

                                //make bubbles big
                                d3.select(this)
                                    .transition()
                                    .duration(1000)
                                    .attr("r", 100);
                            })
                            // 6) Create "mouseout" event listener to hide tooltip
                            .on("mouseout", function(event, d) {
                                toolTip.hide(d);

                                d3.select(this)
                                    .transition()
                                    .duration(1000)
                                    .attr("r", 15);
                            });

                        // 7) axes labels
                        // 
                        chartGroup.append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("y", 0 - margin.left + 0)
                            .attr("x", 0 - (chartHeight / 2))
                            .attr("dy", "1em")
                            .attr("class", "axisText")
                            .text("Confirmed Cases");

                        chartGroup.append("text")
                            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 30})`)
                            .attr("class", "axisText")
                            .text("State");
                    });
                }