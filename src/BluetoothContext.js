
import React, { createContext, useState, useCallback } from 'react';

export const BluetoothContext = createContext();

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

export const BluetoothProvider = ({ children }) => {
    const [device, setDevice] = useState(null);
    const [server, setServer] = useState(null);

    if (navigator.bluetooth) {
        // Web Bluetooth API is available; proceed with your code
        console.log("Web Bluetooth API is available in this browser.");
      } else {
        // Web Bluetooth API is not available; show an error message or fallback behavior
        console.error("Web Bluetooth API is not available in this browser.");
      }
    
      enableBluetooth()  


    const connectToDevice = useCallback(async (device) => {

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
      
            /*const ramp_service = await gattServer.getPrimaryService('b3f8665e-9514-11ed-9f96-37eb16895c01')
            const ramp_min_value_characteristic = await ramp_service.getCharacteristic('b5720d32-9514-11ed-985d-7300cdba6b00');
            const ramp_min_value = await ramp_min_value_characteristic.readValue();
            console.log('ramp_min_value: ' + ramp_min_value.getUint8(0));
      */
            setDevice(device);
            setServer(gattServer);
      
          } catch (error) {
            console.log('Something went wrong: ' + error);
          }

    }, []);

    const disconnectFromDevice = useCallback(() => {
        if (device && device.gatt.connected) {
            device.gatt.disconnect();
            setDevice(null);
            setServer(null);
        }
    }, [device]);

    const writeValue = async (serviceUuid, characteristicUuid, value) => {
        const service = await server.getPrimaryService(serviceUuid);
        const characteristic = await service.getCharacteristic(characteristicUuid);
        await characteristic.writeValue(value);
    };

    const readValue = async (serviceUuid, characteristicUuid) => {
        const service = await server.getPrimaryService(serviceUuid);
        const characteristic = await service.getCharacteristic(characteristicUuid);
        const value = await characteristic.readValue();
        return value;
    };

    return (
        <BluetoothContext.Provider
            value={{
                device,
                connectToDevice,
                disconnectFromDevice,
                writeValue,
                readValue
            }}
        >
       <h1>Web Bluetooth with React</h1>
      {device ? <p>Connected to: {device.name}</p> : <p>Not connected</p>}
      <button onClick={connectToDevice}>Connect</button>
      {children}
      </BluetoothContext.Provider>
    );
};

//    