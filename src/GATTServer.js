import React, { useEffect, useContext } from 'react';
import { BluetoothContext } from './BluetoothContext';
import GATTCharacteristicControl from './GATTCharacteristicControl';
import GATTCharacteristicControlDropdown from './GATTCharacteristicControlDropdown';

const serviceUuid = 'b3f8665e-9514-11ed-9f96-37eb16895c01'; //  Ramp Counter 1
const charRampMinValueUuid = 'b5720d32-9514-11ed-985d-7300cdba6b00'; // Ramp Min Value 
const charRampMaxValueUuid = 'b5720d32-9514-11ed-985d-7300cdba6b01'; // Ramp Max Value
const charRampCurrentValueUuid = 'b5720d32-9514-11ed-985d-7300cdba6b02'; // Ramp Current Value
const charRampCommandValueUuid = 'b5720d32-9514-11ed-985d-7300cdba6b03'; // Command



const GATTServer = () => {
    const { device, connectToDevice, disconnectFromDevice } = useContext(BluetoothContext);

/*
    useEffect(() => {
        const connect = async () => {
            console.log("GATTServer.js connect() called");
            try {
                const device = await navigator.bluetooth.requestDevice({
                    filters: [{ services: [serviceUuid] }],
                    optionalServices: [serviceUuid]
                });
    
                await connectToDevice(device);
            } catch (err) {
                console.log(err);
            }
        };
    
        connect();
    
        return () => {
            disconnectFromDevice();
        };
    }, [connectToDevice, disconnectFromDevice]);
*/
    if (!device) {
        console.log("GATTServer.js device is null");
        return (
            <div>
            </div>
        );
    }
    else if (!device.gatt.connected) {
        console.log("GATTServer.js device.gatt.connected is false");
        return (
            <div>
            </div>
        );

    }
    else if (device.gatt.connected) {
        console.log("GATTServer.js device.gatt.connected is true");

        return (
            <div>
                <h3>GATT Server</h3>
                <GATTCharacteristicControl name="Ramp Min Value" uuid={charRampMinValueUuid} isReadOnly={false} isWriteOnly={false}/>
                <GATTCharacteristicControl name="Ramp Max Value" uuid={charRampMaxValueUuid} isReadOnly={false} isWriteOnly={false}/>
                <GATTCharacteristicControl name="Ramp Current Value" uuid={charRampCurrentValueUuid} isReadOnly={true} isWriteOnly={false}/>
                <GATTCharacteristicControlDropdown name="Ramp Command" uuid={charRampCommandValueUuid} isReadOnly={false} isWriteOnly={true}/>
            </div>
        );
    }
};

export default GATTServer;
