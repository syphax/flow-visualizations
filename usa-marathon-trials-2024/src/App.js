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
        <p> This visualization shows the relative distance between each runner in the 2024
          U.S. Marathon trials and the runner in 3rd place 
          (the last Olympic qualifying spot) at different time intervals. 
          Runners to the left of the dark zero-line are behind the 3rd place runner; runners to the right (up to 2) are ahead. 
          The top 3 runners at any time have orange circles.
          The runners are ordered by their final placing; top finishers at the top.
          Each vertical line represents 100m (relative to the 3rd place runner).
          Use the slider to scroll through different parts of the race.</p>
          <p class='footnote'>NOTE: The runners' positions are interpolated from the splits available for each mile, 
          and are thus approximate.
        </p>
        <p class='footnote'>NOTE: The women have secured 3 spots for the Olympic Marathon. 
        The men currently have two, are seem likely to get the third. I sure hope they do!
        </p>
        <DataLoader onDataLoaded={setData} />
        {data.length > 0 ? <MarathonChart data={data} /> : <p>Loading data...</p>}

      </header>
    </div>
  );
}

export default App;
