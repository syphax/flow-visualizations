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
          (the last Olympic qualifying spot- definitely for the women; probably for the men) at different time intervals.
          The runners are ordered by their final placing.
          Each thin vertical line represents 100m (relative to the 3rd place runner).
          Use the slider to scroll through different parts of the race.
          <p></p>NOTE: The runners' positions are interpolated from the splits available for each mile, 
          and so are approximate- we don't have e.g. GPS data to locate the runners more precisely.
          Yes, the data probably exists for many/most runners, but compiling it all is a tall order.
        </p>
        <DataLoader onDataLoaded={setData} />
        {data.length > 0 ? <MarathonChart data={data} /> : <p>Loading data...</p>}

      </header>
    </div>
  );
}

export default App;
