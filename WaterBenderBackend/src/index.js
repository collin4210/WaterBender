'use strict';
const noble = require('@abandonware/noble');
const express = require('express');
const { fstat } = require("fs");
var BluetoothHciSocket = require('@abandonware/bluetooth-hci-socket');

const fs = require('fs');
const PORT = process.env.port || 6969;
const api = express();
const { arrayBuffer, json } = require("stream/consumers");
const DataPath = './src/Data/Data.json';

var ServiceUUID = "9ee426ae-b884-497d-92a9-248c6b02c079";
var MoistureUUID = "e1d17504-e068-4386-ab40-9a94bff5a960";
var MinMoistureUUID ="329eccd3-3cb6-4838-8ded-faa81ec07445";

var MoistureCharacteristic = null;
var MinMoistureCharacteristic = null;

noble.on('stateChange', (state) => {
    if (state === 'poweredOn') {
      console.log('Starte Scanning...');
      noble.startScanning([ServiceUUID], false);
    }
    else {
      console.log("Stoppe Scanning...");
      noble.stopScanning();

    }
  });

  noble.on('discover', (peripheral) => {
    noble.stopScanning();
    console.log('Peripheral gefunden: ' + peripheral.localName);
    peripheral.connect((error) => {
      peripheral.discoverServices(
        [ServiceUUID], 
        (error, services) => {
          services.forEach((service) => {
            console.log('Service gefunden:', service.uuid);
            service.discoverCharacteristics([], (error, characteristics) => {
              characteristics.forEach((characteristic) => {
                console.log('Charakteristic gefunden:', characteristic.uuid);
                if (MoistureUUID == 
                    characteristic.uuid) {
                  MoistureCharacteristic= characteristic;
                }
                else if (MinMoistureUUID == 
                         characteristic.uuid) {
                  MinMoistureCharacteristic = characteristic;
                }
           
              });
              if (
                MinMoistureCharacteristic && MoistureCharacteristic
              ) {
                writeData();
              }
              else {
                console.error('Nicht alle Charakteristiken gefunden.');
              }
          });
        });
      });
    });
  })


  function writeData()  {
    fs.readFile(DataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return
        }
    
        let Daten = JSON.parse(data);


        characteristic.read(function (error, data) {});
                    characteristic.on('read', function (data, isNotification) {
                        
                        console.log(data.toString());

                    }.bind(this));

    });


  }

api.use(express.json());

api.listen(PORT, () => {
    console.log("API läuft!")
});

api.get('/', (req, res) => {
    console.log(req);
    res.send('Hello World!');
});

fs.readFile(DataPath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return
    }

    let Daten = JSON.parse(data);
});

api.get('/Plant/:PlantID/Moisture', (req,res) => {
    fs.readFile(DataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return
        }
    
        let Daten = JSON.parse(data);
    
        let thisPlant = Daten.find(Plant => Plant.PlantID == parseInt(req.params.PlantID));
      
        if (!thisPlant) res.status(404).send('Plant not found');
        res.status(200).send(thisPlant.Moisture.toString());
    
    
    });



});

api.get('/Plant/:PlantID/MinMoisture', (req,res) => {
    fs.readFile(DataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return
        }
    
        let Daten = JSON.parse(data);
    
        let thisPlant = Daten.find(Plant => Plant.PlantID == parseInt(req.params.PlantID));
      
        if (!thisPlant) res.status(404).send('Plant not found');
        res.status(200).send(thisPlant.MinMoisture.toString());
    
    
    });



});


api.put('/Plant/:PlantID/MinMoisture', (req,res) => {
    fs.readFile(DataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return
        }
    
        let Daten = JSON.parse(data);
    
        let thisPlant = Daten.find(Plant => Plant.PlantID == parseInt(req.params.PlantID));
      
        if (!thisPlant) res.status(404).send('Plant not found');
         
        thisPlant.MinMoisture = req.body.MinMoisture;

        let newData = JSON.stringify(Daten);

        fs.writeFile(DataPath, newData, 'utf8', function (err) {
            if(err) {
                return console.log(err);
            }

        
        console.log("saved!");
        res.status(201).send("updated successfully!");        
        });
    });

    

});

