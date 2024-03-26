//import logo from './logo.svg';
import './App.css';

//import React, { useState, useEffect } from 'react';
import React, { useState } from 'react';
//import { MantineProvider } from '@mantine/core';

// import RunnersChart from './RunnersChart'; 
//import DataViewer from './DataViewer';

import DataLoader from './DataLoader';
import MarathonChart from './MarathonChart';

function App() {

  const [data, setData] = useState([]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>2024 US Marathon Trials Visualizer</h1>
        <p class='intro'> This visualization shows the relative distance between each runner in the 2024
          U.S. Marathon trials and the runner in 3rd place 
          (the last Olympic qualifying spot) over the course of the race at one minute intervals. 
          Runners to the left of the dark zero-line are behind the 3rd place runner; runners to the right (up to 2) are ahead. 
          The top 3 runners at any time have orange circles.
          The runners are ordered by their final placing; top finishers at the top.
          Each vertical grey line represents 1/4 mile (relative to the 3rd place runner).
          Orange lines and text indicate mile markers.</p>
          <p class='controls'>Controls:
          <li>Select either the Men's or Women's race</li>
          <li>Choose how runners are sorted- either by their final placing (default) or current placing</li>
          <li>Use the slider to scroll through different parts of the race</li>
          <li>Use the Play/Stop buttons to animate the race</li>
          <li>Select specific runners from the panel on the left; selected runners will be highlighted</li>
          </p>
          <p class='footnote'>NOTE: The runners' positions are interpolated from the splits available for each mile, 
          and are thus approximate.
        </p>
        <p class='footnote'>NOTE: The women have secured 3 spots for the Olympic Marathon. 
        The men currently have two, are seem likely to get the third. I sure hope they do!
        </p>
        <p class='footnote'>
          <a href='https://forms.gle/9uNBqnzJJmpDMDyH7' target="_blank" rel="noreferrer">Share your feedback here</a>
        </p>
        <DataLoader onDataLoaded={setData} />
        {data.length > 0 ? <MarathonChart data={data} /> : <p>Loading data...</p>}

      </header>
    </div>
  );
}

export default App;
