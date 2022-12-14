
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include "TM1637.h"

// See the following for generating UUIDs:
// https://www.uuidgenerator.net/

#define SERVICE_UUID "9ee426ae-b884-497d-92a9-248c6b02c079"
#define CHARACTERISTIC_UUID_MOISTURE "e1d17504-e068-4386-ab40-9a94bff5a960"
#define CHARACTERISTIC_UUID_MINMOISTURE "329eccd3-3cb6-4838-8ded-faa81ec07445"
int  CLK = 16;
int DIO = 17;
int sensorPin = 26;
int sensorValue = 0;
int relayPin = 14;
char arr[4];
TM1637 tm(CLK, DIO);
int minValue = 2500;
std::string input;
bool deviceConnected = false;
BLECharacteristic* MoistureCharacteristic;
BLECharacteristic* MinMoistureCharacteristic;

class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
    };

    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
    }
};




void setup() {
  Serial.begin(115200);
  Serial.println("Starting BLE work!");

  tm.init();
  tm.set(7);

  // initialize digital pin LED_BUILTIN as an output.
  pinMode(14, OUTPUT);


  BLEDevice::init("MoistureSensorLucas");
  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  BLEService *pService = pServer->createService(SERVICE_UUID);
  MoistureCharacteristic = pService->createCharacteristic(
                             CHARACTERISTIC_UUID_MOISTURE,
                             BLECharacteristic::PROPERTY_READ
                           );

  MinMoistureCharacteristic = pService->createCharacteristic(
                                CHARACTERISTIC_UUID_MINMOISTURE,
                                BLECharacteristic::PROPERTY_READ |
                                BLECharacteristic::PROPERTY_WRITE

                              );
  MinMoistureCharacteristic->setValue("2500");


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
  int txValue = analogRead(sensorPin);

  MoistureCharacteristic->setValue(txValue);
  input = MinMoistureCharacteristic->getValue();
  strcpy(arr, input.c_str());


  minValue = atoi(arr);


  tm.display(3, txValue % 10);
  tm.display(2, txValue / 10 % 10 );
  tm.display(1, txValue / 100 % 10);
  tm.display(0, txValue / 1000 % 10);



  if (txValue < minValue) {
    digitalWrite(relayPin, HIGH);

  }

  // put your main code here, to run repeatedly:
  delay(2000);
}
