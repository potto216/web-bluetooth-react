import logo from './logo.svg';
import './App.css';

import BluetoothConnector from './BluetoothConnector';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <BluetoothConnector />
      </header>


    </div>
  );
}
// Todo write function to display the data from the bluetooth device  on the screen 
function displayData(data) {
  console.log(data);
}       

export default App;
