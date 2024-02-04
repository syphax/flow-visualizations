// DataLoader.js

//import React, { useEffect } from 'react';
import { useEffect } from 'react';
import * as d3 from 'd3';

function DataLoader({ onDataLoaded }) {

  console.log('Hello from DataLoader')

  useEffect(() => {
    d3.csv(process.env.PUBLIC_URL + "/data/result_men_by_5min.csv").then(loadedData => {
      const parsedData = loadedData.map(d => ({
        name: d.name,
        time: +d.time_min,
        distance: +d.distance
      }));
      console.log('DataLoader: Data is loaded'); // Debugging
      onDataLoaded(parsedData);
    }).catch(error => {
      console.error("Error loading CSV:", error);
    });
  }, [onDataLoaded]);

  // Optionally, return a loading indicator or null if no UI is needed
  return null
}

export default DataLoader;
