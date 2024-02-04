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
        <p>2024 US Marathon Trials Visualizer</p>
        <DataLoader onDataLoaded={setData} />
        {data.length > 0 ? <MarathonChart data={data} /> : <p>Loading data...</p>}

      </header>
    </div>
  );
}

export default App;
