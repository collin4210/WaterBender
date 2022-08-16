const express = require('express');
const { fstat } = require("fs")
const fs = require('fs');
const PORT = process.env.port || 6969;
const api = express();
const { arrayBuffer, json } = require("stream/consumers");
const DataPath = './src/Data/Data.json';



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

