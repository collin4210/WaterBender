
#include <Arduino.h>
#include "TM1637.h"
int CLK = 16;
int DIO = 17;


int sensorPin = 26;
int sensorValue = 0;
TM1637 tm(CLK,DIO);

void setup() {
  tm.init();
  tm.set(7);

  // initialize digital pin LED_BUILTIN as an output.
  pinMode(14, OUTPUT);
}

// the loop function runs over and over again forever
void loop() {
  digitalWrite(14, LOW);
      
      sensorValue = analogRead(sensorPin);
     
     
       tm.display(3,sensorValue % 10);
  tm.display(2,sensorValue /10 % 10 );
  
  tm.display(1,sensorValue /100 % 10);
  tm.display(0,sensorValue /1000 % 10);
  if (sensorValue < 2500) {
  digitalWrite(14, HIGH);
  delay(5000);
  
                    }  
    
}