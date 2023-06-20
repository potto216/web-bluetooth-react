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
      
      /*
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['device_information'] }],
      });
      */
      //Bluetooth device 58:bf:25:9c:50:7e advertising and waiting for connections...

    
      const device = await navigator.bluetooth.requestDevice(
        {
          filters: [{
            services: ['b3f8665e-9514-11ed-9f96-37eb16895c01'],
             name:'DV'
          }]
          
        });

      setDevice(device);
      
      const gattServer = await device.gatt.connect();
      /*
      const service = await gattServer.getPrimaryService('device_information');
      const characteristic = await service.getCharacteristic('hardware_revision_string');
      const value = await characteristic.readValue();
      console.log('Hardware Revision: ' + value.getUint8(0)); */

      const ramp_service = await gattServer.getPrimaryService('b3f8665e-9514-11ed-9f96-37eb16895c01')
      const ramp_min_value_characteristic = await ramp_service.getCharacteristic('b5720d32-9514-11ed-985d-7300cdba6b00');
      const ramp_min_value = await ramp_min_value_characteristic.readValue();
      console.log('ramp_min_value: ' + ramp_min_value.getUint8(0));

      

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
