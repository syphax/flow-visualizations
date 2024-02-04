// MarathonChart.js

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
//import { Slider } from '@mantine/core';

function MarathonChart({ data }) {

  console.log('MarathonChart');

  const [selectedTime, setSelectedTime] = useState(0);
  const svgRef = useRef();

  useEffect(() => {

    // Function to draw the chart, similar to previous examples
    const drawChart = () => {

        const filteredData = data.filter(d => d.time === selectedTime);

        if (!filteredData.length) return; 

        if (!filteredData) return; // Guard clause if data is not yet available
        
        filteredData.sort((a, b) => b.distance - a.distance);

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear SVG before redrawing

        // Set dimensions
        const width = 1000;
        const height = filteredData.length * 20;
        svg.attr("width", width).attr("height", height);

        // Scale for distances
        const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.distance * 1.5)])
        .range([0, width]);

        // Color scale
        const colorScale = d3.scaleLinear()
        .domain([d3.min(filteredData, d => d.distance), d3.max(filteredData, d => d.distance)])
        .range(["lightblue", "darkblue"]);
        
        // Create a group for each runner
        const runnerGroups = svg.selectAll(".data")
        .data(filteredData)
        .enter()
        .append("g")
        .attr("transform", (d, i) => `translate(0, ${i * 5})`);

        // Add lines for distances
        runnerGroups.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", d => xScale(d.distance))
        .attr("y2", 0)
        //.attr("stroke", "blue")
        .attr("stroke", d => colorScale(d.distance))
        .attr("stroke-width", 4);

        // Add names
        runnerGroups.append("text")
        .attr("x", d => xScale(d.distance) + 5) // Position text at the end of the line
        .attr("y", (d, i) => i ) // Adjust y based on row index
        .attr("text-anchor", "start") // Adjust text anchor to start
        .text(d => d.name)
        .style("font-size", "small");
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
              step="5"
            />
          </label>
          <svg ref={svgRef} style={{ alignSelf: 'stretch' }}></svg>
        </div>
      );
    }

export default MarathonChart;
