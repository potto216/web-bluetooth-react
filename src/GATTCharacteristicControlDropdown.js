import React, { useState, useContext, useEffect, useCallback } from 'react';
import { BluetoothContext } from './BluetoothContext';

const serviceUuid = 'b3f8665e-9514-11ed-9f96-37eb16895c01'; // Ramp Counter 1

const rampCommands = [
  { value: 0, text: "Stop Counter" },
  { value: 1, text: "Start Counter" },
  { value: 2, text: "Reset Counter" },
  { value: 3, text: "Test I/O" },
];

const GATTCharacteristicControlDropdown = ({ name, uuid, isReadOnly, isWriteOnly }) => {
    const { writeValue, readValue } = useContext(BluetoothContext);
    const [value, setValue] = useState(rampCommands[0].value);

    const handleUpdate = async () => {
        if (!isReadOnly) {
            console.log("GATTCharacteristicControlDropdown.js handleUpdate() called with uuid", uuid);
            let charValue = Uint8Array.of(value);
            await writeValue(serviceUuid, uuid, charValue);
        } else {
            console.log("GATTCharacteristicControlDropdown.js handleUpdate() isReadOnly called with uuid", uuid);
            const charValue = await readValue(serviceUuid, uuid);           
            setValue((charValue.getUint8(0)).toString());
        }
    };

    // ... (rest of your existing code)

    const handleChange = (event) => {
        console.log("GATTCharacteristicControlDropdown.js handleChange() called with event", event.target.value);
        setValue(parseInt(event.target.value));
    }

    // ... (rest of your existing useEffect and useCallback)

    return (
        <div>
            <label htmlFor={uuid + "-name"} className="label-class">{name + ": "}</label>
            <select
                id={uuid + "-value"}
                value={value}
                disabled={isReadOnly}
                onChange={handleChange}
            >
                {rampCommands.map((cmd) => (
                    <option key={cmd.value} value={cmd.value}>
                        {cmd.text}
                    </option>
                ))}
            </select>

            <button
                onClick={handleUpdate}
                disabled={false}>
                Update
            </button>
        </div>
    );
};

export default GATTCharacteristicControlDropdown;
