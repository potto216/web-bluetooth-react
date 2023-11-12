import logo from './teledyne_lecroy_logo.svg';
//import logo from './logo.svg';
import './App.css';

//import BluetoothConnector from './BluetoothConnector';
import { BluetoothProvider } from './BluetoothContext';
import GATTServer from './GATTServer';

function App() {

  return (
    <div className="App">
      <header className="App-header">

        <BluetoothProvider>
            <GATTServer />
        </BluetoothProvider>
        <img src={logo} className="App-logo" alt="logo" />
      </header>


    </div>
  );
  
}
// Todo write function to display the data from the bluetooth device  on the screen 
function displayData(data) {
  console.log(data);
}       

export default App;
