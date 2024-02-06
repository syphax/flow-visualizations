// MarathonChart.js

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

function MarathonChart({ data }) {

  console.log('MarathonChart');

  const svgRef = useRef();
  const [selectedTime, setSelectedTime] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [selectedRunners, setSelectedRunners] = useState([]);

  const uniqueRunnerNames = [...new Set(data.map(d => d.name))];

  const handleSliderChange = (event) => {
    setSelectedTime(Number(event.target.value));
  };

  const handleCheckboxChange = (runnerName) => {
    setSelectedRunners(prev => {
      if (prev.includes(runnerName)) {
        return prev.filter(r => r !== runnerName); // Remove runner if already selected
      } else {
        return [...prev, runnerName]; // Add runner if not selected
      }
    });
  };

  const handlePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      const id = setInterval(() => {
        setSelectedTime(prevTime => {
          const nextTime = prevTime + 1;
          if (nextTime > Math.max(...data.map(d => d.time))) {
            clearInterval(id);
            setIsPlaying(false);
          }
          return nextTime <= Math.max(...data.map(d => d.time)) ? nextTime : prevTime;
        });
      }, 100);
      setIntervalId(id);
    }
  };

  const handleStop = () => {
    clearInterval(intervalId);
    setIsPlaying(false);
  };

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
        const height = filteredData.length * 8;
        svg.attr("width", width).attr("height", height);

        // Scale for distances
        const xScale = d3.scaleLinear()
        //.domain([d3.min(filteredData, d => d.distance_diff_m), d3.max(filteredData, d => d.distance_diff_m * 1.5)])
        .domain([-3200, 1000])
        .range([0, width]);

        // Vertical lines
        svg.append("line") // Append a new line element for the zero line
          .attr("x1", xScale(0))
          .attr("y1", 0)
          .attr("x2", xScale(0))
          .attr("y2", height) 
          .attr("stroke", "black") // Dark color for the line at zero
          .attr("stroke-width", 4); // Make it a bit thicker

          for (let i = -1600; i <= 800; i += 100) {
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
        //.domain([d3.min(filteredData, d => d.distance_diff_m), d3.max(filteredData, d => d.distance_diff_m)])
        .domain([-1600, 400])
        .range(["lightblue", "darkblue"]);
        
        // Create a group for each runner
        const runnerGroups = svg.selectAll(".data")
        .data(filteredData)
        .enter()
        .append("g")
        .attr("transform", (d, i) => `translate(0, ${(i + 4) * 5})`);

        // Add lines for distances

        runnerGroups.append("line")
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", d => xScale(d.distance_diff_m))
          .attr("y2", 0)
          //.attr("stroke", "blue")
          .attr("stroke", d => colorScale(d.distance_diff_m))
          .attr("stroke-width", d => selectedRunners.includes(d.name) ? 3 : 1); // Thicker line for selected runners
          //.attr("stroke-width", 1); // Make the line thinner

        // Add circles at the right end of each line
        runnerGroups.append("circle")
          .attr("cx", d => xScale(d.distance_diff_m))
          .attr("cy", 0) // Adjust if your y positioning is different
          //.attr("r", 4) // Small radius for the circle
          //.attr("fill", "white") // White or light gray interior
          //.attr("fill", d => d.distance_diff_m >= 0 ? "orange" : "white")
          .attr("r", d => selectedRunners.includes(d.name) ? 6 : 3) // Bigger radius for selected runners
          .attr("fill", d => selectedRunners.includes(d.name) ? "yellow" : d.distance_diff_m >= 0 ? "orange" : "white")
        
          .attr("stroke", "blue") // Thin blue border
          .attr("stroke-width", 1); // Make the border thin
          
          // .each(function(d) { 
          //   d3.select(this)
          //     .append("title")
          //     .text(`Runner: ${d.name}, Distance convered (mi): ${d.distance}, Distance from 3rd (m): ${d.distance_diff_m}`);
          // });

        // Add names
        runnerGroups.append("text")
        .attr("x", d => xScale(d.distance_diff_m) + 8) // Position text at the end of the line
        .attr("y", (d, i) => 2 ) // Adjust y based on row index
        .attr("text-anchor", "start") // Adjust text anchor to start
        .text(d => d.name)
        .attr("fill", "white")
        //.style("font-size", "small");
        //.style("font-size", "10px"); 
        .style("font-size", d => selectedRunners.includes(d.name) ? "14px" : "10px"); // Bigger font size for selected runners

        const firstRunnerWithZeroDiff = filteredData.filter(d => d.distance_diff_m === 0)[0];
        console.log(firstRunnerWithZeroDiff)
        if (firstRunnerWithZeroDiff) {
          const formattedValue = `${(firstRunnerWithZeroDiff.distance).toFixed(1)}M`;
          console.log(formattedValue)
          svg.append("text")
            .attr("x", xScale(0))
            .attr("y", 14) // Adjust this based on your chart's layout
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .style("font-size", "16px")
            .text(formattedValue);
          }
        };

    drawChart();
  }, [data, selectedTime, selectedRunners]); 

    // const handleSliderChange = (event) => {
    //     setSelectedTime(Number(event.target.value));
    // };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        {/* Controls container for slider and buttons */}
        <div className='controls-container' style={{ width: '80%', marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Slider */}
          <input
            type="range"
            min="0"
            max={Math.max(0, ...data.map(d => d.time))}
            value={selectedTime}
            onChange={handleSliderChange}
            step="1"
            style={{ width: '80%' }}
          />
          <p>Time: {selectedTime} minutes</p>
          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '10px' }}>
            <button onClick={handlePlay} disabled={isPlaying}>Play</button>
            <button onClick={handleStop}>Stop</button>
          </div>
        </div>
  
        {/* Panel and Chart container */}
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
          {/* Checkbox Panel */}
          <div className="checkbox-panel" style={{ marginRight: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', fontWeight: 'bold' }}>
            Runners:
            </div>
            {uniqueRunnerNames.map((runnerName, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  id={`checkbox-${runnerName}`}
                  checked={selectedRunners.includes(runnerName)}
                  onChange={() => handleCheckboxChange(runnerName)}
                />
              <label htmlFor={`checkbox-${runnerName}`} style={{ fontSize: '12px' }}>{runnerName}</label>
                
              </div>
            ))}
          </div>
  
          {/* Chart */}
          <svg ref={svgRef} style={{ width: '100%', height:'1060px' }}></svg>
        </div>
      </div>
    );

    }

export default MarathonChart;
