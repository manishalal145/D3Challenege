// Event listener for window resize.
// When the browser window is resized, makeResponsive() is called.

d3.select(window).on("resize", makeResponsive);

function makeResponsive() {

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
var svgArea = d3.select("body").select("svg");
if (!svgArea.empty()) {
  svgArea.remove();
  CreateChart();
}

CreateChart();

function CreateChart(){

// svg params
var svgWidth = 980;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100,
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

// Append division class chart to scatter element
var chart = d3.select("#scatter").append("div").classed("chart", true);

// Append SVG element to the chart with appropriate height and width
var svg = chart.append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
 d3.csv("assets/data/data.csv").then(function(chartData) {
    
  // Step 1: Parse Data/Cast as numbers
    // ==============================
    chartData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
      });
  
      // Step 2: Create scale functions
      // ==============================
      var xScale = d3.scaleLinear()
        .domain([d3.min(chartData, d=>d.poverty)*0.8, d3.max(chartData, d=>d.poverty)*1.2])
        .range([0,width]);
  
      var yScale = d3.scaleLinear()
        .domain([d3.min(chartData, d=>d.healthcare)* 0.8, d3.max(chartData, d=>d.healthcare) * 1.2])
        .range([height, 0]);
  
      // Step 3: Create axis functions
      // ==============================
      var bottomAxis = d3.axisBottom(xScale);
      var leftAxis = d3.axisLeft(yScale);
  
      // Step 4: Append Axes to the chartgroup
      // =====================================
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
  
      chartGroup.append("g")
        .call(leftAxis);
  
      // Step 5: Create Circles
      // ==============================
      var circlesGroup = chartGroup.selectAll("circle")
       .data(chartData)
       .enter()
       .append("circle")
       .attr("cx", d => xScale(d.poverty))
       .attr("cy", d => yScale(d.healthcare))
       .attr("r", "12")
       .attr("fill", "DodgerBlue")
       .attr("opacity", ".5");

     // Step 6: Append text to circles
     // ==============================
      var textGroup= chartGroup.selectAll(".stateText")
       .data(chartData)
       .enter()
       .append("text")
       .attr("x", d => xScale(d.poverty))
       .attr("y", d => yScale(d.healthcare))
       .text(d=>(d.abbr))
       .attr("class", "stateText")
       .attr("font-size", "10px")

     // Step 7: Initialize tooltip
     // ==============================
     var toolTip = d3.select("body")
      .append("div")
      .classed("d3-tip", true);
      
      //Create "mouseover" event listener to display tooltip
      circlesGroup.on("mouseover", function(d) {
        toolTip.style("display", "block")
            .html(
              `<strong>${d.state}</strong><br>
              ${"Healthcare: " + d.healthcare + "%"}<br>${"Poverty: " + d.poverty + "%"}`)
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY + "px");
            })
      
      //Create "mouseout" event listener to hide tooltip
        .on("mouseout", function() {
          toolTip.style("display", "none");
        });
  
      // Step 8: Create axes labels
      // ==============================
      chartGroup.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 0 - margin.left + 40)
       .attr("x", 0 - (height / 2))
       .attr("dy", "1em")
       .attr("class", "axisText")
       .text("Lacks Healthcare (%)");

       chartGroup.append("text")
       .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
       .attr("class", "axisText")
       .text("In Poverty(%)");

    }).catch(error => console.log(error)) 
  }
}

makeResponsive();