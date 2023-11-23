import React, { useState, useContext, useEffect, useCallback } from 'react';
import { BluetoothContext } from './BluetoothContext';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
const serviceUuid = 'b3f8665e-9514-11ed-9f96-37eb16895c01'; //  Ramp Counter 1
const options = {
    scales: {
        x: {
            ticks: {
                color: 'white',
                font: {
                    size: 14 // Set x-axis label font size
                }
            },
            title: {
                display: true,
                text: 'Sample #',
                color: 'white',
                font: {
                    size: 18 // Set x-axis title font size
                }
            }
        },
        y: {
            ticks: {
                color: 'white',
                font: {
                    size: 14 // Set y-axis label font size
                }
            },
            title: {
                display: true,
                text: 'Counter Value',
                color: 'white',
                font: {
                    size: 18 // Set y-axis title font size
                }
            }
        }
    },
    plugins: {
        legend: {
            labels: {
                font: {
                    size: 14 // Set legend font size
                }
            }
        }
    }
    // ... other options
};

const GATTCharacteristicControlPlot = ({ name, uuid, isReadOnly, isWriteOnly, dataLabelName }) => {
    const { writeValue, readValue, startNotifications, stopNotifications } = useContext(BluetoothContext);
    const [value, setValue] = useState("");
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [graphData, setGraphData] = useState({ labels: [], datasets: [{ label: dataLabelName, data: [] }] });

    const handleNotification = useCallback((event) => {
        const newValue = event.target.value.getUint8(0); // assuming value is Uint8
        setValue(newValue.toString());
        setGraphData(prevData => ({
            labels: [...prevData.labels, prevData.labels.length + 1],
            datasets: [{ ...prevData.datasets[0], data: [...prevData.datasets[0].data, newValue] }]
        }));
        console.log("Notification received with value", newValue);
    }, []);

    const toggleNotifications = async () => {
        if (!notificationsEnabled) {
            await startNotifications(serviceUuid, uuid, handleNotification);
        } else {
            await stopNotifications(serviceUuid, uuid);
        }
        setNotificationsEnabled(!notificationsEnabled);
    };

    // ... rest of your existing code for handleUpdate, handleRead, showChange, and useEffect
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
        //setValue(event.target.value)
    }

    useEffect(() => {
        console.log("GATTCharacteristicControl.js useEffect() called");
        handleRead();

    }, [handleRead]);

    console.log("GATTCharacteristicControlPlot.js return() called value is '", value.toString(), "' of type ", typeof value);

    return (
        <div>
            <label htmlFor={uuid + "-name"} className="label-class">{name + ": "}</label>
            <input
                id={uuid + "-value"}
                type="text"
                value={value}
                disabled={isReadOnly}
                onChange={(event) => setValue(event.target.value)}
                className="input-width-ch" // Applying the CSS class
            />
            <button onClick={handleUpdate} disabled={isReadOnly}>Update</button>
            <button onClick={toggleNotifications}>
                {notificationsEnabled ? 'Stop Notifications' : 'Start Notifications'}
            </button>

            <div>
                { /*<h4>{name} Graph</h4> */ }
                <Line data={graphData} options={options} className="chart-container" />
            </div>
        </div>
    );
};

export default GATTCharacteristicControlPlot;
