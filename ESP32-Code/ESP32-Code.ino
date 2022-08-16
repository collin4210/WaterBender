
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include "TM1637.h"

// See the following for generating UUIDs:
// https://www.uuidgenerator.net/

#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID_MOISTURE "beb5483e-36e1-4688-b7f5-ea07361b26a8"
#define CHARACTERISTIC_UUID_MINMOISTURE "4d1f510a-58a6-49d9-a740-12834459c84e"
int  CLK = 16;
int DIO = 17;
int sensorPin = 26;
int sensorValue = 0;
#define relayPin 14
TM1637 tm(CLK,DIO);
int minValue = 2500;
 BLECharacteristic* MoistureCharacteristic;

void setup() {
  Serial.begin(115200);
  Serial.println("Starting BLE work!");

  tm.init();
  tm.set(7);

  // initialize digital pin LED_BUILTIN as an output.
  pinMode(14, OUTPUT);


  BLEDevice::init("MoistureSensorLucas");
  BLEServer *pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService(SERVICE_UUID);
  MoistureCharacteristic = pService->createCharacteristic(
                                         CHARACTERISTIC_UUID_MINMOISTURE,
                                         BLECharacteristic::PROPERTY_READ 
                                       );

  //pCharacteristic->setValue("Hello World says Neil");
  pService->start();
  // BLEAdvertising *pAdvertising = pServer->getAdvertising();  // this still is working for backward compatibility
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);  // functions that help with iPhone connections issue
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();
  Serial.println("Characteristic defined! Now you can read it in your phone!");
}

void loop() {
     digitalWrite(relayPin, LOW);
     int txValue = analogRead(26);
     MoistureCharacteristic->setValue(std::to_string(txValue));
    
     
  tm.display(3,txValue % 10);
  tm.display(2,txValue /10 % 10 );
  
  tm.display(1,txValue /100 % 10);
  tm.display(0,txValue /1000 % 10);

  if (txValue < minValue) {
  digitalWrite(relayPin, HIGH);

  }

  // put your main code here, to run repeatedly:
  delay(2000);
}
