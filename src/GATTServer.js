import React, { useEffect, useContext } from 'react';
import { BluetoothContext } from './BluetoothContext';
import GATTCharacteristicControl from './GATTCharacteristicControl';
import GATTCharacteristicControlPlot from './GATTCharacteristicControlPlot';
import GATTCharacteristicControlDropdown from './GATTCharacteristicControlDropdown';

const serviceUuid = 'b3f8665e-9514-11ed-9f96-37eb16895c01'; //  Ramp Counter 1
const charRampMinValueUuid = 'b5720d32-9514-11ed-985d-7300cdba6b00'; // Ramp Min Value 
const charRampMaxValueUuid = 'b5720d32-9514-11ed-985d-7300cdba6b01'; // Ramp Max Value
const charRampCurrentValueUuid = 'b5720d32-9514-11ed-985d-7300cdba6b02'; // Ramp Current Value
const charRampCommandValueUuid = 'b5720d32-9514-11ed-985d-7300cdba6b03'; // Command
const charRampCommandStatusUuid = 'b5720d32-9514-11ed-985d-7300cdba6b04'; // Command Status  BLERead | BLENotify
const charRampStatusUuid = 'b5720d32-9514-11ed-985d-7300cdba6b05'; // Status  BLERead | BLENotify
const charRampStepTimeUuid = 'b5720d32-9514-11ed-985d-7300cdba6b06'; // Command Status  BLERead | BLEWrite 





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
            <div className="gatt-server">
                <div className="gatt-controls">
                <br></br>
                <br></br>
                <GATTCharacteristicControl name="Counter Min Value" uuid={charRampMinValueUuid} isReadOnly={false} isWriteOnly={false} enableNotifications={false}/>
                <GATTCharacteristicControl name="Counter Max Value" uuid={charRampMaxValueUuid} isReadOnly={false} isWriteOnly={false} enableNotifications={false}/>
                <GATTCharacteristicControl name="Counter Step Time" uuid={charRampStepTimeUuid} isReadOnly={false} isWriteOnly={false} enableNotifications={false}/>
                <GATTCharacteristicControl name="Counter Status" uuid={charRampStatusUuid} isReadOnly={true} isWriteOnly={false}/>
                 <br></br>      
                <GATTCharacteristicControlDropdown name="Counter Command" uuid={charRampCommandValueUuid} isReadOnly={false} isWriteOnly={true}/>
                <GATTCharacteristicControl name="Command Status" uuid={charRampCommandStatusUuid} isReadOnly={true} isWriteOnly={false}/>

                    
                </div>
                <div className="gatt-plot">
                  <GATTCharacteristicControlPlot name="Ramp Current Value" uuid={charRampCurrentValueUuid} isReadOnly={true} isWriteOnly={false} dataLabelName="Counter Value"/>
                </div>
                <br></br>
            </div>
            <br></br>
            <br></br>
            </div>
        );
    }
};

export default GATTServer;
