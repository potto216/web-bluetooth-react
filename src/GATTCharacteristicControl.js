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
        const value = await readValue(serviceUuid, uuid);
        setValue(value);
    }, [readValue, uuid]);

    useEffect(() => {
        handleRead();
    }, [handleRead]);

    return (
        <div>
            <label htmlFor={uuid + "-name"}>{name}</label>
            <input id={uuid + "-name"} type="text" value={name} readOnly={true} />

            <label htmlFor={uuid + "-uuid"}>{uuid}</label>
            <input id={uuid + "-uuid"} type="text" value={uuid} readOnly={true} />

            <label htmlFor={uuid + "-value"}>Value</label>
            <input
                id={uuid + "-value"}
                type="text"
                value={value}
                disabled={isReadOnly}
                onChange={(event) => setValue(event.target.value)}
            />

            <button
                onClick={handleUpdate}
                disabled={isReadOnly}>
                Update
            </button>
        </div>
    );
};

export default GATTCharacteristicControl;
