// DataLoader.js

//import React, { useEffect } from 'react';
import { useEffect, useState } from 'react';
import * as d3 from 'd3';

function DataLoader({ onDataLoaded }) {

  console.log('Hello from DataLoader')
  const [gender, setGender] = useState('men');

  useEffect(() => {
    const filename = gender === 'men' ? 'result_men_by_1min.csv' : 'result_women_by_1min.csv';
    d3.csv(process.env.PUBLIC_URL + "/data/" + filename).then(loadedData => {
      const parsedData = loadedData.map(d => ({
        name: d.name,
        time: +d.time_min,
        distance: +d.distance,
        distance_diff_m: +d.distance_diff_m,
        final_place: +d.final_place
      }));

      console.log('DataLoader: Data is loaded'); // Debugging
      onDataLoaded(parsedData);
    }).catch(error => {
      console.error("Error loading CSV:", error);
    });
  }, [onDataLoaded, gender]);

  // Optionally, return a loading indicator or null if no UI is needed
  return (
    <div className='dropdown'>
      <label htmlFor="gender-select">Select Race:</label>
      <select value={gender} onChange={e => setGender(e.target.value)}>
        <option value="men">Men</option>
        <option value="women">Women</option>
      </select>
      {/* Render your chart or data presentation here */}
    </div>
  );
}

export default DataLoader;
