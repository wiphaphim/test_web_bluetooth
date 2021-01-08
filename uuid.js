var bluetoothDevice
let options = {filters: [], optionalServices: []}

let serviceUuid = 0xfff0

let characteristicUuid = 0xfff1; //! for notify
// let characteristicUuid = 0xfff2; //! for read and write reponse

options.filters.push({services: [serviceUuid]})
options.optionalServices.push(serviceUuid)

let accept_all = {optionalServices: [serviceUuid], acceptAllDevices: true}

const onDisconnected = (event) => {
    const device = event.target;
    console.log(`> Device ${device.name} is disconnected.`);
  }

//? >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> notify <<<<<<<<<<<<<<<<<<<<<<<<<<<<
  
var myCharacteristic;

const onStartButtonClick = async () => {
try {
    console.log("Requesting Bluetooth Device...");
    const device = await navigator.bluetooth.requestDevice(options);

    console.log("Connecting to GATT Server...");
    const server = await device.gatt.connect();

    await device.addEventListener('gattserverdisconnected', onDisconnected);

    console.log("Getting Service...");
    const service = await server.getPrimaryService(serviceUuid);

    console.log("Getting Characteristic...");
    myCharacteristic = await service.getCharacteristic(
    characteristicUuid
    );

    await myCharacteristic.startNotifications();

    console.log("> Notifications started");
    myCharacteristic.addEventListener(
    "characteristicvaluechanged",
    handleNotifications
    );
} catch (error) {
    console.log("Argh! " + error);
    document.getElementById("resultRead").innerHTML = 'Error = ' + error;
}
};

const onStopButtonClick = async () => {
if (myCharacteristic) {
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
}
};

const handleNotifications = (event) => {
    const decoder = new TextDecoder('utf-8');
    let value = event.target.value;
    console.log("> value ===> ", decoder.decode(value));
    }

//* >>>>>>>>>>>>>>>>>>>>>>> wrtite <<<<<<<<<<<<<<<<<<
// const writeTest = () => {
//     try {
//         console.log("Requesting Bluetooth Device...");
//         navigator.bluetooth.requestDevice(options)
//         .then((device) => {
//             console.log("Connecting to GATT Server...");
//             device.addEventListener('gattserverdisconnected', onDisconnected)
//             return device.gatt.connect()
//         })
//         .then(server => {
//             console.log("Getting Service...");
//             return server.getPrimaryService(serviceUuid)
//         })
//         .then(service => {
//             console.log("Getting Characteristic...");
//             return service.getCharacteristic(characteristicUuid)
//         })
//         .then((characteristic) => {
//             console.log("Writing...");
//             // data = Uint32Array.of(6161616161)
//             const encoder = new TextEncoder('utf-8');
//             // const data = encoder.encode("'writeValue' on 'BluetoothRemoteGATTCharacteristic': Value can't exceed 512 bytes.");
//             const data = encoder.encode("bf1d049c6791b9c7c884f7e7c5d9fef3c216808c");
//             return characteristic.writeValue(data)
//             // .catch(error => console.log("error ===>", error))
//         })
//         .then((_) => {
//             console.log("write success");
//         })
//         .catch((error) => {
//             console.error(error);
//         });
//     } catch (error) {
//         console.log("Argh! " + error);
//     }
//   };

  const writeTest = async() => {
    try {
        console.log('Requesting Bluetooth Device...');
        const device  = await navigator.bluetooth.requestDevice(options);
    
        console.log('Connecting to GATT Server...');
        const server = await device.gatt.connect();

        // const reconnect = async() => {
        //     if (!device) {
        //         return;
        //       }
        //       if (device.gatt.connected) {
        //         consloe.log('> Bluetooth Device is already connected');
        //         return;
        //       }
        //       try {
        //         console.log("Reconnecting...");
        //         await navigator.bluetooth.requestDevice(options)
        //         await device.gatt.connect();
        //       } catch(error) {
        //         console.log('Argh! ' + error);
        //       }
        // }

        await device.addEventListener('gattserverdisconnected', onDisconnected);
    
        console.log('Getting Service...');
        const service = await server.getPrimaryService(serviceUuid);
    
        console.log('Getting Characteristic...');
        const characteristic = await service.getCharacteristic(characteristicUuid);
    
        console.log("Writing...");
        // data = Uint32Array.of(6161616161)
        const encoder = new TextEncoder('utf-8');
        const data1 = encoder.encode("data_1 ====> 'writeValue' on 'BluetoothRemoteGATTCharacteristic': Value can't exceed 512 bytes.");
        const data2 = encoder.encode("data_2 ====> bf1d049c6791b9c7c884f7e7c5d9fef3c216808c");
        const data3 = encoder.encode("data_3 ====> bf1d049c6791b9c7c884f7e7c5d9fef3c216808c");
        await characteristic.writeValue(data1);
        await characteristic.writeValue(data2);
        await characteristic.writeValue(data3);
    
        console.log('> write success');
      } catch(error) {
        console.log('Argh! ' + error);
        document.getElementById("resultRead").innerHTML = 'Error = ' + error;
      }
    
  };

//* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Read <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const readTest = () => {
    try {
        console.log("Requesting Bluetooth Device...");
        navigator.bluetooth.requestDevice(options)
        .then((device) => {
            console.log("Connecting to GATT Server...");
            device.addEventListener('gattserverdisconnected', onDisconnected)
            return device.gatt.connect()
        })
        .then(server => {
            console.log("Getting Service...");
            return server.getPrimaryService(serviceUuid)
        })
        .then(service => {
            console.log("Getting Characteristic...");
            return service.getCharacteristic(characteristicUuid)
        })
        .then((characteristic) => {
            console.log("Reading...");
            return characteristic.readValue()
            // .catch(error => console.log("error ===>", error))
        })
        .then((value) => {
            let data = value.getUint8()
            console.log("value ===>", data);
        })
        .catch((error) => {
            console.error(error);
        });
    } catch (error) {
        console.log("Argh! " + error);
        document.getElementById("resultRead").innerHTML = 'Error = ' + error;
    }
    
  };

//+ >>>>>>>>>>>>>>>>>>>>>> Read and write to Bluetooth descriptors <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

const readDescription = () => {
    try {
        console.log("Requesting Bluetooth Device...");
        navigator.bluetooth.requestDevice(options)
        .then((device) => {
            console.log("Connecting to GATT Server...");
            device.addEventListener('gattserverdisconnected', onDisconnected)
            return device.gatt.connect()
        })
        .then(server => {
            console.log("Getting Service...");
            return server.getPrimaryService(serviceUuid)
        })
        .then(service => {
            console.log("Getting Characteristic...");
            return service.getCharacteristic(characteristicUuid)
        })
        .then(characteristic => {
            console.log("Getting description...");
            return characteristic.getDescriptor('gatt.characteristic_user_description')  
        })
        .then(descriptor => descriptor.readValue())
        .then(value => {
            const decoder = new TextDecoder('utf-8');
            console.log(`> User Description: ${decoder.decode(value)}`);
        })
        .catch(error => { console.error(error); });
    } catch (error) {
      console.log("Argh! " + error);
    }
    
  }
  
  const writeDescription = () => {
    try {
        console.log("Requesting Bluetooth Device...");
        navigator.bluetooth.requestDevice(options)
        .then((device) => {
            console.log("Connecting to GATT Server...");
            device.addEventListener('gattserverdisconnected', onDisconnected)
            return device.gatt.connect()
        })
        .then(server => {
            console.log("Getting Service...");
            return server.getPrimaryService(serviceUuid)
        })
        .then(service => {
            console.log("Getting Characteristic...");
            return service.getCharacteristic(characteristicUuid)
        })
        .then(characteristic => {
            console.log("Getting description...");
            return characteristic.getDescriptor('gatt.characteristic_user_description')  
        })
        .then(descriptor => {
            const encoder = new TextEncoder('utf-8');
            const userDescription = encoder.encode('Defines the time between measurements.');
            return descriptor.writeValue(userDescription);
        })
        .then(() => console.log("write end"))
        .catch(error => { console.error(error); });
    } catch (error) {
      console.log("Argh! " + error);
    }
    
  }
