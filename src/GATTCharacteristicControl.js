import React, { useState, useContext, useEffect, useCallback } from 'react';
import { BluetoothContext } from './BluetoothContext';

const serviceUuid = 'b3f8665e-9514-11ed-9f96-37eb16895c01'; //  Ramp Counter 1

const GATTCharacteristicControl = ({ name, uuid, isReadOnly, isWriteOnly, enableNotifications=true  }) => {
    const {  writeValue, readValue, startNotifications, stopNotifications  } = useContext(BluetoothContext);
    const [value, setValue] = useState("");
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    const handleNotification = useCallback((event) => {
        const value = event.target.value;
        setValue((value.getUint8(0)).toString());
        console.log("Notification received with value", value);
    }, []);

    const toggleNotifications = async () => {
        if (!notificationsEnabled) {
            await startNotifications(serviceUuid, uuid, handleNotification);
        } else {
            await stopNotifications(serviceUuid, uuid);
        }
        setNotificationsEnabled(!notificationsEnabled);
    };

    const handleUpdate = async () => {
        if (!isReadOnly ) {
            console.log("GATTCharacteristicControl.js handleUpdate() called with uuid", uuid);
            let charValue = Uint8Array.of(parseInt(value));
            await writeValue(serviceUuid, uuid, charValue);
        }
        else{
            console.log("GATTCharacteristicControl.js handleUpdate() isReadOnly called with uuid", uuid)
            const charValue = await readValue(serviceUuid, uuid);           
            setValue((charValue.getUint8(0)).toString());
        }
    };

    const handleRead = useCallback(async () => {
        console.log("GATTCharacteristicControl.js handleRead() called with uuid", uuid);
        try {
            if (!isWriteOnly)
            {
                const charValue = await readValue(serviceUuid, uuid);           
                setValue((charValue.getUint8(0)).toString());
            }

          } catch (e) {
            console.error(e);
          }

    }, [readValue, uuid]);

    const showChange = (event) => {
        console.log("GATTCharacteristicControl.js showChange() called with event", event.target.value);
        console.log("GATTCharacteristicControl.js showChange() isWriteOnly is ", isWriteOnly);
        setValue(event.target.value)
    }

    useEffect(() => {
        console.log("GATTCharacteristicControl.js useEffect() called");
        handleRead();

    }, [handleRead]);

    console.log("GATTCharacteristicControl.js return() called value is '", value.toString(), "' of type ", typeof value);

    return (
        <div>
            <label htmlFor={uuid + "-name"} className="label-class" >{name + ": "}</label>
            <input
                id={uuid + "-value"}
                type="text"
                value={value}
                disabled={isReadOnly}
                onChange={showChange}
                className="input-width-ch" // Applying the CSS class
            />

            <button
                onClick={handleUpdate}
                disabled={isReadOnly}>
                Update
            </button>

            {/* Conditional rendering of notification button */}
            {enableNotifications && (
                <button onClick={toggleNotifications}>
                    {notificationsEnabled ? 'Stop Notifications' : 'Start Notifications'}
                </button>
            )}
            
        </div>
    );
};

//  

export default GATTCharacteristicControl;
