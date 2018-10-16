// D3 Scatterplot Assignment
// Create a scatter plot with D3.js.
// When the browser window is resized, responsify() is called.
d3.select(window).on("resize", makeResponsive);

// When the browser loads, makeResponsive() is called.
makeResponsive();

// The code for the chart is wrapped inside a function
// that automatically resizes the chart
function makeResponsive() {
// Define SVG area dimensions
var svgWidth = 810;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
    top: 10,
    right: 30,
    bottom: 100,
    left: 100
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select(".chart")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
                    .attr("transform",`translate(${margin.left}, ${margin.top})`);

// Append a div to the body to create tooltips, assign it a class
d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

//  Load data from data.csv
d3.csv("data/data.csv", function(error, corrData){

    // Throw an error if one occurs
    if(error) throw error;

    // Print the corrData
    console.log(corrData);

    // Cast the poverty and education values to a number
    corrData.forEach(function (d){
        d.poverty = +d.poverty;
        d.education = +d.education;
        console.log(d)
    });
    
    // Configure a Linear scale with a range between 0 and the chartWidth
    // Set the domain for the xLinearScale function
    // d3.extent returns the an array containing the min and max values for the property specified
    var xLinearScale = d3.scaleLinear()
                         .range([0, chartWidth])
                         .domain(d3.extent(corrData, data => data.poverty));
                         

    // Configure a linear scale with a range between the chartHeight and 0
    // Set the domain for the yLinearScale function
    var yLinearScale = d3.scaleLinear()
                         .range([chartHeight, 0])
                         .domain([0, d3.max(corrData, data => data.education)]);
    
    // Create two new functions passing the scales in as arguments
    // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Scale the domain
    var xMin = d3.min(corrData, function(data) {
        return +data.poverty * 0.9;
    });

    var xMax = d3.max(corrData, function(data) {
        return +data.poverty * 1;
    });

    var yMin = d3.min(corrData, function(data) {
        return +data.education* 0.8;
    });

    var yMax = d3.max(corrData, function(data) {
        return +data.education * 1.04;
    });
    
    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([yMin, yMax]);

    // Append Axes to the chart
    chartGroup.append("g")
              .attr("transform", `translate(0, ${chartHeight})`)
              .call(bottomAxis);
    
    chartGroup.append("g")
              .call(leftAxis);
    
    // Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
                                 .data(corrData)
                                 .enter()
                                 .append("circle")
                                 .attr("cx", d => xLinearScale(d.poverty))
                                 .attr("cy", d => yLinearScale(d.education))
                                 .attr("r", "15")
                                 .attr("fill", "darkcyan")
                                 .attr("opacity", ".75")
                                
                          chartGroup.append("text")
                                    .style("text-anchor","middle")
                                    .style("font-size","12px")
                                    .selectAll("tspan")
                                    .data(corrData)
                                    .enter()
                                    .append("tspan")
                                        .attr("x", function (d) {
                                            return xLinearScale(d.poverty);
                                        })
                                        .attr("y", function (d) {   
                                            return yLinearScale(d.education-0.1);
                                        })
                                        .text(function(d){
                                            return d.abbr
                                        });
    // Initialize tool tip
    var toolTip = d3.tip()
                    .attr("class", "tooltip")
                    .offset([80, -60])
                    .html(d =>`${d.state}<br>Poverty: ${d.poverty}<br>Education: ${d.education}`
    );

    // Create tooltip in the chart
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data);
      })
      // onmouseout event
      .on("mouseout", function (data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 0 - margin.left + 40)
              .attr("x", 0 - (chartHeight / 2))
              .attr("dy", "1em")
              .attr("class", "axisText")
              .text("Education (%)");
        });
    chartGroup.append("text")
              .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 30})`)
              .attr("class", "axisText")
              .text("In Poverty (%)");
        };