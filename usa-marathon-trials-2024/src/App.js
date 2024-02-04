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
        <p>Load Data</p>
        {/* <DataViewer /> 
        */}
        <DataLoader onDataLoaded={setData} />
        {data.length > 0 ? <MarathonChart data={data} /> : <p>Loading data...</p>}

      </header>
    </div>
  );
}

export default App;

// // function App() {
// //   const [runners, setRunners] = useState([]);

// //   useEffect(() => {
// //     d3.csv("/data/result_men_by_5min.csv").then(data => {
// //       console.log(data);
// //       setRunners(data); // Store the loaded data in state
// //     });
// //   }, []); // Empty dependency array means this effect runs once on mount

// //   return (
// //     <div className="App">
// //       {runners.length > 0 ? (
// //         <RunnersChart runners={runners} />
// //       ) : (
// //         <div>Loading data...</div>
// //       )}
// //     </div>
// //   );
// // }

// // export default App;
