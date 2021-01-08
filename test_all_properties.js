let serviceUuid = 0xfff0
// let characteristicUuid = 0xfff1; //! for notify
let characteristicUuid = 0xfff2; //! for read and write reponse

let action = 'write'

let options = {filters: [], optionalServices: []}

let bluetoothDevice
let myCharacteristic

options.filters.push({services: [serviceUuid]})
options.optionalServices.push(serviceUuid)

let accept_all = {optionalServices: [serviceUuid], acceptAllDevices: true}

const onConnectButtonClick = async() => {
    const onDisconnected = (event) => {
        const device = event.target;
        console.log(`> Device ${device.name} is disconnected.`);
    }
    bluetoothDevice = null
    try {
        console.log('Requesting Bluetooth Device...');
        bluetoothDevice = await navigator.bluetooth.requestDevice(options);
        bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);
        
        console.log("Connecting to GATT Server...");
        const server = await bluetoothDevice.gatt.connect();

        console.log("Getting Service...");
        const service = await server.getPrimaryService(serviceUuid);

        console.log("Getting Characteristic...");
        myCharacteristic = await service.getCharacteristic(characteristicUuid)

        const handleNotifications = (event) => {
            const decoder = new TextDecoder('utf-8');
            let value = event.target.value;
            console.log("> value ===> ", decoder.decode(value));
        }

        if (action == 'start_notify') {
            try {
                myCharacteristic.startNotifications();
                console.log("> Notifications started");

                myCharacteristic.addEventListener(
                "characteristicvaluechanged",
                handleNotifications
                );
            } catch (error) {
                console.log("Argh! " + error);
            }
        } else if (action === 'stop_notify') {
            try {
            await myCharacteristic.stopNotifications();
            console.log("> Notifications stopped");
            myCharacteristic.removeEventListener(
                "characteristicvaluechanged",
                handleNotifications
            );
            } catch (error) {
            console.log("Argh! " + error);
            }
        } else if (action === 'read') {
            try { 
            console.log('Reading Battery Level...');
            const value = await myCharacteristic.readValue();
            const decoder = new TextDecoder('utf-8');
            console.log('> Battery Level is ' + decoder.decode(value) + '%');
            } catch(error) {
                console.log('Argh! ' + error);
            }          
        } else if (action === 'write') {
            try {
                console.log("Writing...");
                // data = Uint32Array.of(6161616161)
                const encoder = new TextEncoder('utf-8');
                const data1 = encoder.encode("data_1 ====> 'writeValue' on 'BluetoothRemoteGATTCharacteristic': Value can't exceed 512 bytes.");
                const data2 = encoder.encode("data_2 ====> 627306b68115345e286059cea6d8365c216c5bd4b3f275940caebf49cddc1bd245b0e8619e9c43b1cc50a5aa1b12d561dcf4fec93931cc014b957a20e77e826174ad38788232008a011f2cdd1d7c05486472be8cce3ded86c92393b12ff4d09d1eb16914627306b68115345e286059cea6d8365c216c5bd4b3f275940caebf49cddc1bd245b0e8619e9c43b1cc50a5aa1b12d561dcf4fec93931cc014b957a20e77e826174ad38788232008a011f2cdd1d7c05486472be8cce3ded86c92393b12ff4d09d1eb16914");
                const data3 = encoder.encode("data_3 ====> 627306b68115345e286059cea6d8365c216c5bd4b3f275940caebf49cddc1bd245b0e8619e9c43b1cc50a5aa1b12d561dcf4fec93931cc014b957a20e77e826174ad38788232008a011f2cdd1d7c05486472be8cce3ded86c92393b12ff4d09d1eb16914627306b68115345e286059cea6d8365c216c5bd4b3f275940caebf49cddc1bd245b0e8619e9c43b1cc50a5aa1b12d561dcf4fec93931cc014b957a20e77e826174ad38788232008a011f2cdd1d7c05486472be8cce3ded86c92393b12ff4d09d1eb16914627306b68115345e286059cea6d8365c216c5bd4b3f275940caebf49cddc1bd245b0e8619e9c43b1cc50a5aa1b12d561dcf4fec93931cc014b957a20e77e826174ad38788232008a011f2cdd1d7c05486472be8cce3ded86c92393b12ff4d09d1eb16914");
                await myCharacteristic.writeValue(data1);
                await myCharacteristic.writeValue(data2);
                await myCharacteristic.writeValue(data3);
            
                console.log('> write success');
            } catch (error) {
                console.log('Argh! ' + error);
            }
        }

    } catch (error) {
        console.log('Argh! ' + error);
    }
}

