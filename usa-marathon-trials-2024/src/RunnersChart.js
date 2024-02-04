import React, { useState, useEffect } from 'react';
import { Slider } from '@mantine/core';
import * as d3 from 'd3';

const RunnersChart = ({ runners }) => {
  const [selectedTime, setSelectedTime] = useState(5); // Default or initial time
  const svgRef = React.useRef();

  // D3 chart drawing function
  const drawChart = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear SVG

    // Set dimensions
    const width = 800;
    const height = runners.length * 30;
    svg.attr("width", width).attr("height", height);

    // Scale for distances
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(runners, d => d.distance)])
      .range([0, width]);

    // Create a group for each runner
    const runnerGroups = svg.selectAll(".runner")
      .data(runners)
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(0, ${i * 30})`);

    // Add lines for distances
    runnerGroups.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", d => xScale(d.distance))
      .attr("y2", 0)
      .attr("stroke", "blue");

    // Add names
    runnerGroups.append("text")
      .attr("x", -5)
      .attr("y", 0)
      .attr("text-anchor", "end")
      .text(d => d.name)
      .style("font-size", "small");
  };

  // Redraw chart when selected time changes
  useEffect(() => {
    drawChart();
  }, [selectedTime]);

  return (
    <>
      <Slider
        min={0}
        max={60} // Assuming times are up to an hour for simplicity
        value={parseInt(selectedTime.split(":")[1], 10)} // Convert "MM:SS" to minutes as integer
        onChange={(value) => setSelectedTime(`00:${value < 10 ? `0${value}` : value}`)}
        label={(value) => `00:${value < 10 ? `0${value}` : value}`}
        marks={[
          { value: 0, label: '00:00' },
          { value: 30, label: '00:30' },
          { value: 60, label: '01:00' }
        ]}
      />
      <svg ref={svgRef}></svg>
    </>
  );
};

export default RunnersChart;
