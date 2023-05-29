import React, { useState } from 'react';

let isAvailable

async function enableBluetooth() {
  try {
    isAvailable = await navigator.bluetooth.getAvailability();
    console.log('Bluetooth is enabled: ', isAvailable);
  } catch (e) {
    console.error(e);
    isAvailable = false;
  }
}

const BluetoothConnector = () => {
  const [device, setDevice] = useState(null);
  // test if bluetooth is supported
    if (navigator.bluetooth) {
    // Web Bluetooth API is available; proceed with your code
    console.log("Web Bluetooth API is available in this browser.");
  } else {
    // Web Bluetooth API is not available; show an error message or fallback behavior
    console.error("Web Bluetooth API is not available in this browser.");
  }

  enableBluetooth();

  const connect = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['device_information'] }],
      });
      setDevice(device);
      
      const gattServer = await device.gatt.connect();
      const service = await gattServer.getPrimaryService('device_information');
      const characteristic = await service.getCharacteristic('hardware_revision_string');
      const value = await characteristic.readValue();

      console.log('Hardware Revision: ' + value.getUint8(0));
    } catch (error) {
      console.log('Something went wrong: ' + error);
    }
  };

  return (
    <div>
      <h1>Web Bluetooth with React</h1>
      {device ? <p>Connected to: {device.name}</p> : <p>Not connected</p>}
      <button onClick={connect}>Connect</button>
    </div>
  );
};

export default BluetoothConnector;
