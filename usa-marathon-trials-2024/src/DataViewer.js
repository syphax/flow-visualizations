// DataVewer.js

import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

function DataViewer() {
  const [data, setData] = useState([]);

  console.log('Hello from DataViewer')

  useEffect(() => {
    // Load the CSV data
    d3.csv(process.env.PUBLIC_URL + "data/result_men_by_5min.csv").then(loadedData => {
      // Convert numeric fields from string to numbers
      const parsedData = loadedData.map(d => ({
        name: d.name,
        time: +d.time_min, // 'time_min' is a numeric field representing minutes or seconds
        distance: +d.distance // Convert 'distance' from string to number
      }));
      setData(parsedData);
    });
  }, []); // Empty dependency array means this runs once on component mount

  return (
    <div>
      <h2>Data Loaded from CSV</h2>
      <ul>
        {data.map((d, i) => (
          <li key={i}>{`Name: ${d.name}, Time: ${d.time}, Distance: ${d.distance}`}</li>
        ))}
      </ul>
    </div>
  );
}

export default DataViewer;
