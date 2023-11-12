
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
      console.log("About to run enableBluetooth from BluetoothProvider");
      enableBluetooth()  

    const connectToDevice = useCallback(async (device) => {
        try {   
            const device = await navigator.bluetooth.requestDevice(
              {
                filters: [{
                  services: ['b3f8665e-9514-11ed-9f96-37eb16895c01'],
                   name:'GATT_Server'
                }]
                
              });
      
            setDevice(device);
            const gattServer = await device.gatt.connect();
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
      return await characteristic.readValue();
  };

  const startNotifications = async (serviceUuid, characteristicUuid, callback) => {
      const service = await server.getPrimaryService(serviceUuid);
      const characteristic = await service.getCharacteristic(characteristicUuid);
      characteristic.addEventListener('characteristicvaluechanged', callback);
      await characteristic.startNotifications();
  };

  const stopNotifications = async (serviceUuid, characteristicUuid) => {
      const service = await server.getPrimaryService(serviceUuid);
      const characteristic = await service.getCharacteristic(characteristicUuid);
      characteristic.removeEventListener('characteristicvaluechanged', characteristic.value);
      await characteristic.stopNotifications();
  };

  const handleConnectionButtonClick = () => {
    if (device && device.gatt.connected) {
        disconnectFromDevice();
    } else {
        connectToDevice();
    }
  };

  return (
      <BluetoothContext.Provider
      value={{
          device,
          connectToDevice,
          disconnectFromDevice,
          writeValue,
          readValue,
          startNotifications,
          stopNotifications
      }}
        >
      <h1>Web Bluetooth demo with Wireless Protocol Suite</h1>
      <button  className="large-button"onClick={handleConnectionButtonClick}>
                {device && device.gatt.connected ? 'Disconnect' : 'Connect'}
      </button>
      {device ? <p>Connected to: {device.name}</p> : <p>Not connected</p>}

      {children}
      </BluetoothContext.Provider>
    );
};

export default BluetoothProvider;