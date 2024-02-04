import logo from './logo.svg';
import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { RunnersChart } from './RunnersChart';

//import { runners } from './data'; // Assuming you export your data from a 'data.js' file

d3.csv("./data/results_mens_by_5min.csv").then(function(runners) {
  // Now `data` is an array of objects
  // Each object represents a row in the CSV, with column headers as keys
  
  console.log(runners);

});

function App() {
  return (
    <div className="App">
      <RunnersChart runners={runners} />
    </div>
  );
}

export default App;