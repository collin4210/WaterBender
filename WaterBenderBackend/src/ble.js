const noble = require('noble');

const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const CHARACTERISTIC_UUID_MOISTURE = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
const CHARACTERISTIC_UUID_MINMOISTURE = "4d1f510a-58a6-49d9-a740-12834459c84e";

const serviceUUIDs = [SERVICE_UUID.replace(/\-/g, '')];
const characteristicUUIDs = [CHARACTERISTIC_UUID_MINMOISTURE.replace(/\-/g, ''), CHARACTERISTIC_UUID_MOISTURE.replace(/\-/g, '')];
const allowDuplicates = true;

noble.on('stateChange', function (state) {
    if (state === 'poweredOn') {

        noble.startScanning(serviceUUIDs);
        console.log("scanning...");
    } else
        noble.stopScanning();
});
noble.on('discover', function (peripheral) {
    console.log('Connecting to name: ' + peripheral.advertisement.localName);
    peripheral.connect(function (error) {
        console.log('Connected!');
        if (error) { console.error(error); }
        peripheral.discoverSomeServicesAndCharacteristics(serviceUUIDs, characteristicUUIDs, (e, s, c) => {
            if (s.length == 0 || c.length == 0) {
                console.error("Couldn't find Service?");
                return;
            }
            console.log('Sensor found!');
            var Moisture_characteristic = c[1];
            Moisture_Characteristics.subscribe()
            Moisture_Characteristics.on('data', (d) => {
                console.log('data...');
                process.stdout.write(d.toString());
            })
        })
    });
});