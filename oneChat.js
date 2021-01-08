
oneChatBluetoothCallBackData(type, data)
Type :
-	get_device_service
-	get_service
-	get_characteristic
-	read_characteristic

 	// webkit.messageHandlers.requestDevice.postMessage()
// callBack Type : get_device_service(bluetooth_name)

webkit.messageHandlers.scanDevice.postMessage()
callBack Type : get_device_service([bluetooth_name])

// webkit.messageHandlers.connectBluetooth.postMessage(bluetooth_name) -> device.connect -> [uuid_service]
	
	webkit.messageHandlers.getPrimaryService.postMessage(bluetooth_name)
	callBack Type : get_service([uuid_service])

	 webkit.messageHandlers.getCharacteristic.postMessage(uuid_service)
	callBack Type : get_characteristic([{uuid: characteristic_uuid, type: “read/write”}])

	webkit.messageHandlers.readCharacteristic.postMessage(uuid_characteristic)
callBack Type : read_characteristic(data)

webkit.messageHandlers.writeCharacteristic.postMessage(uuid_characteristic, writeData)
callBack Type : read_characteristic(data)


oneChatBluetoothCallBackData(“get_service”,”["UUID1",    "UUID2",    "UUID3"  ]”)

oneChatBluetoothCallBackData("get_characteristic","[ { "uuid" :"UUID1", type: “read”}, { "uuid" :"UUID2", type: “write”}]")