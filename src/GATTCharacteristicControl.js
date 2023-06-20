import React, { useState, useContext, useEffect, useCallback } from 'react';
import { BluetoothContext } from './BluetoothContext';

const serviceUuid = 'b3f8665e-9514-11ed-9f96-37eb16895c01'; //  Ramp Counter 1


const GATTCharacteristicControl = ({ name, uuid, isReadOnly }) => {
    const { writeValue, readValue } = useContext(BluetoothContext);
    const [value, setValue] = useState("");

    const handleUpdate = async () => {
        if (!isReadOnly) {
            await writeValue(serviceUuid, uuid, value);
        }
    };

    const handleRead = useCallback(async () => {
        console.log("GATTCharacteristicControl.js handleRead() called with uuid", uuid);
        const value = await readValue(serviceUuid, uuid);
        setValue(value);
    }, [readValue, uuid]);

    useEffect(() => {
        console.log("GATTCharacteristicControl.js useEffect() called");
        handleRead();

    }, [handleRead]);

    console.log("GATTCharacteristicControl.js return() called value is ", value.toString(), " is null ", value===null, " type is ", typeof value);

    return (
        <div>
            <label htmlFor={uuid + "-name"}>{name + ": "}</label>
            <input
                id={uuid + "-value"}
                type="text"
                value={value==="" ? "" : value.getUint8(0)}
                disabled={isReadOnly}
            />

            <button
                onClick={handleUpdate}
                disabled={isReadOnly}>
                Update
            </button>
        </div>
    );
};

//  onChange={(event) => setValue(event.target.value)}

export default GATTCharacteristicControl;
