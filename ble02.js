var bluetoothDevice
let options = {filters: [], optionalServices: []}

let serviceUuid = "battery_service"
let characteristicUuid = "battery_level";

options.filters.push({services: [serviceUuid]})
options.optionalServices.push(serviceUuid)

let accept_all = {optionalServices: [serviceUuid], acceptAllDevices: true}

const onScanButtonClick = async() => {
    // bluetoothDevice = null
    try {
        console.log('Requesting Bluetooth Device...');
        bluetoothDevice = await navigator.bluetooth.requestDevice(options);
        bluetoothDevice.addEventListener('gattserverdisconnected', onReconnectButtonClick);
        connect();
    } catch (error) {
        console.log('Argh! ' + error);
    }
} 

const connect = async() => {
    console.log('Connecting to Bluetooth Device...');
    await bluetoothDevice.gatt.connect();
    console.log('> Bluetooth Device connected');
    console.log('>>> Name:             ' + bluetoothDevice.name);
    console.log('>>> Id:               ' + bluetoothDevice.id);
    console.log('>>> Connected:        ' + bluetoothDevice.gatt.connected);
  }
  
const onDisconnectButtonClick = () => {
    if (!bluetoothDevice) {
      return;
    }
    console.log('Disconnecting from Bluetooth Device...');
    if (bluetoothDevice.gatt.connected) {
      bluetoothDevice.gatt.disconnect();
    } else {
      console.log('> Bluetooth Device is already disconnected');
    }
  }
  
const onDisconnected = (event) => {
  const device = event.target;
  console.log(`> Device ${device.name} is disconnected.`);
}
  
const onReconnectButtonClick = () => {
    if (!bluetoothDevice) {
      return;
    }
    if (bluetoothDevice.gatt.connected) {
      console.log('> Bluetooth Device is already connected');
      return;
    }
    try {
      connect();
    } catch(error) {
      console.log('Argh! ' + error);
    }
  }

  //* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Read <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const onReadButtonClick = async() => {
    try {       
    console.log('Requesting Bluetooth Device...');
    const device = await navigator.bluetooth.requestDevice({
      filters: [{services: ['battery_service']}]})

    console.log('Connecting to GATT Server...');
    const server = await device.gatt.connect();

    const reconnect = async() => {
      if (!device) {
          return;
        }
        if (device.gatt.connected) {
          consloe.log('> Bluetooth Device is already connected');
          return;
        }
        try {
          console.log("Reconnecting...");
          await device.gatt.connect();
        } catch(error) {
          console.log('Argh! ' + error);
        }
  }

    await device.addEventListener('gattserverdisconnected', reconnect);

    console.log('Getting Battery Service...');
    const service = await server.getPrimaryService('battery_service');

    console.log('Getting Battery Level Characteristic...');
    const characteristic = await service.getCharacteristic('battery_level');

    console.log('Reading Battery Level...');
    const value = await characteristic.readValue();

    console.log('> Battery Level is ' + value.getUint8(0) + '%');
    } catch(error) {
        console.log('Argh! ' + error);
    }
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
    let value = event.target.value;
    let a = [];
    // Convert raw data bytes to hex values just for the sake of showing something.
    // In the "real" world, you'd use data.getUint8, data.getUint16 or even
    // TextDecoder to process raw data bytes.
    for (let i = 0; i < value.byteLength; i++) {
        a.push("0x" + ("00" + value.getUint8(i).toString(16)).slice(-2));
    }
    console.log("> " + a.join(" "));
    }


  //! >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Heart rate <<<<<<<<<<<<<<<<<<<<<<<<<<<<

const writeHeartRate = () => {
    console.log("Requesting Bluetooth Device...");
    navigator.bluetooth
      .requestDevice({ filters: [{ services: ["heart_rate"] }] })
      .then((device) => {
        device.addEventListener('gattserverdisconnected', onDisconnected)
        return device.gatt.connect()
      })
      .then((server) => server.getPrimaryService("heart_rate"))
      .then((service) => 
        service.getCharacteristic("heart_rate_control_point")
      )
      .then((characteristic) => {
        // Writing 1 is the signal to reset energy expended.
        const resetEnergyExpended = Uint8Array.of(1);
        return characteristic.writeValue(resetEnergyExpended);
      })
      .then((_) => {
        console.log("Energy expended has been reset.");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const heartRateNotify = () => {
    navigator.bluetooth
      .requestDevice({ filters: [{ services: ["heart_rate"] }] })
      .then((device) => {
        device.addEventListener('gattserverdisconnected', onDisconnected)
        return device.gatt.connect()
      })
      .then((server) => server.getPrimaryService("heart_rate"))
      .then((service) =>
        service.getCharacteristic("heart_rate_measurement")
      )
      .then((characteristic) => characteristic.startNotifications())
      .then((characteristic) => {
        characteristic.addEventListener(
          "characteristicvaluechanged",
          handleCharacteristicValueChanged
        );
        console.log("Notifications have been started.");
      })
      .catch((error) => {
        console.error(error);
      });

    function handleCharacteristicValueChanged(event) {
      const value = event.target.value;
      console.log("Received " + value.getUint8());
      // TODO: Parse Heart Rate Measurement value.
      // See https://github.com/WebBluetoothCG/demos/blob/gh-pages/heart-rate-sensor/heartRateSensor.js
    }
  }

//+ >>>>>>>>>>>>>>>>>>>>>> Read and write to Bluetooth descriptors <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

const readDescription = () => {
  try {
    navigator.bluetooth.requestDevice({ filters: [{ services: ['health_thermometer'] }] })
    .then((device) => {
      device.addEventListener('gattserverdisconnected', onDisconnected)
      return device.gatt.connect()
    })
    .then(server => server.getPrimaryService('health_thermometer'))
    .then(service => service.getCharacteristic('measurement_interval'))
    .then(characteristic => characteristic.getDescriptor('gatt.characteristic_user_description'))
    .then(descriptor => descriptor.readValue())
    .then(value => {
      const decoder = new TextDecoder('utf-8');
      console.log(`User Description: ${decoder.decode(value)}`);
    })
    .catch(error => { console.error(error); });
  } catch (error) {
    console.log("Argh! " + error);
  }
  
}

const writeDescription = () => {
  try {
    navigator.bluetooth.requestDevice({ filters: [{ services: ['health_thermometer'] }] })
    .then(device => device.gatt.connect())
    .then(server => server.getPrimaryService('health_thermometer'))
    .then(service => service.getCharacteristic('measurement_interval'))
    .then(characteristic => characteristic.getDescriptor('gatt.characteristic_user_description'))
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