// MarathonChart.js

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
//import { Slider } from '@mantine/core';

function MarathonChart({ data }) {

  console.log('MarathonChart');

  const [selectedTime, setSelectedTime] = useState(60);
  const svgRef = useRef();

  useEffect(() => {

    // Function to draw the chart, similar to previous examples
    const drawChart = () => {

        const filteredData_ = data.filter(d => d.time === selectedTime);

        // Replace certain values
        const filteredData = filteredData_.map(d => {
          if (d.final_place === -1) {
            return { ...d, final_place: 300 }; // Create a new object with the adjusted final_place
          } else {
            return d; // Return the original object if no adjustment is needed
          }
        });


        if (!filteredData.length) return; 

        if (!filteredData) return; // Guard clause if data is not yet available
        
        //filteredData.sort((a, b) => b.distance - a.distance);
        // Sort by 'final_place' in ascending order
        filteredData.sort((a, b) => a.final_place - b.final_place);
        
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear SVG before redrawing

        // Set dimensions
        const width = 1000;
        const height = filteredData.length * 20;
        svg.attr("width", width).attr("height", height);

        // Scale for distances
        const xScale = d3.scaleLinear()
        //.domain([d3.min(filteredData, d => d.distance_diff_m), d3.max(filteredData, d => d.distance_diff_m * 1.5)])
        .domain([-3200, 800])
        .range([0, width]);

        // Vertical lines
        svg.append("line") // Append a new line element for the zero line
          .attr("x1", xScale(0))
          .attr("y1", 0)
          .attr("x2", xScale(0))
          .attr("y2", height) // Assuming 'height' is the height of your chart
          .attr("stroke", "black") // Dark color for the line at zero
          .attr("stroke-width", 4); // Make it a bit thicker

          for (let i = -1600; i <= 400; i += 100) {
            svg.append("line") // Append a new line element for each line
              .attr("x1", xScale(i))
              .attr("y1", 0)
              .attr("x2", xScale(i))
              .attr("y2", height) // Assuming 'height' is the height of your chart
              .attr("stroke", "grey") // Lighter color for these lines
              .attr("stroke-width", 1) // Thinner lines
              .attr("stroke-opacity", 0.5)
          }

        // Color scale
        const colorScale = d3.scaleLinear()
        .domain([d3.min(filteredData, d => d.distance_diff_m), d3.max(filteredData, d => d.distance_diff_m)])
        //.domain([-1600, 200])
        .range(["lightblue", "darkblue"]);
        
        // Create a group for each runner
        const runnerGroups = svg.selectAll(".data")
        .data(filteredData)
        .enter()
        .append("g")
        .attr("transform", (d, i) => `translate(0, ${(i + 2) * 5})`);

        // Add lines for distances

        runnerGroups.append("line")
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", d => xScale(d.distance_diff_m))
          .attr("y2", 0)
          //.attr("stroke", "blue")
          .attr("stroke", d => colorScale(d.distance_diff_m))
          .attr("stroke-width", 1); // Make the line thinner

        // Add circles at the right end of each line
        runnerGroups.append("circle")
          .attr("cx", d => xScale(d.distance_diff_m))
          .attr("cy", 0) // Adjust if your y positioning is different
          .attr("r", 3) // Small radius for the circle
          .attr("fill", "white") // White or light gray interior
          .attr("stroke", "blue") // Thin blue border
          .attr("stroke-width", 1); // Make the border thin
    
        // Add names
        runnerGroups.append("text")
        .attr("x", d => xScale(d.distance_diff_m) + 5) // Position text at the end of the line
        .attr("y", (d, i) => 2 ) // Adjust y based on row index
        .attr("text-anchor", "start") // Adjust text anchor to start
        .text(d => d.name)
        //.style("font-size", "small");
        .style("font-size", "10px"); 

        };

    drawChart();
  }, [data, selectedTime]); 

    const handleSliderChange = (event) => {
        setSelectedTime(Number(event.target.value));
    };
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          <label>
            Time: {selectedTime} minutes
            <input
              type="range"
              min="0"
              max={Math.max(0, ...data.map(d => d.time))}
              value={selectedTime}
              onChange={handleSliderChange}
              step="1"
            />
          </label>
          <svg ref={svgRef} style={{ alignSelf: 'stretch' }}></svg>
        </div>
      );
    }

export default MarathonChart;
