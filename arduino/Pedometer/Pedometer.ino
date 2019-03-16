#include "Wire.h"
#include "I2Cdev.h"
#include "MPU6050.h"
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>

#define stepThreshold 90 
 
const uint8_t scl = 14; //D5
const uint8_t sda = 12; //D6
 
MPU6050 mpu;
 
int16_t ax, ay, az;
int16_t gx, gy, gz;

int ax0 = 0;
int ay0 = 0;
int az0 = 0;

int steps = 0;

boolean stepDown = false;
 
void setup()
{

  Serial.begin(115200); //Serial connection
  WiFi.begin("PCKLUB", "p4ssl3npr3pcklub"); //WiFi connection
  while (WiFi.status() != WL_CONNECTED) { //Wait for the WiFI connection completion
  delay(500);
  Serial.println("Waiting for connection");
  }
  
  Wire.begin(sda, scl);
  Serial.begin(115200);
   
  Serial.println("Initialize MPU");
  mpu.initialize();
  Serial.println(mpu.testConnection() ? "Connected" : "Connection failed");

}
 
void loop()
{
  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
  
  //        Serial.println("\ax:");
  //        Serial.print(ax); 
  //        Serial.println("\ay:");
  //        Serial.print(ay); 
  
  readSteps();
  sendSteps();
  
  delay(500);

}

void readSteps() {
  
  float amplitude;
  float amplitude1;
  float amplitude2;

  
  amplitude = sqrt((ax-ax0)^2 + (ay-ay0)^2);
  amplitude1 = sqrt((ax-ax0)^2 + (az-az0)^2);
  amplitude2 = sqrt((ay-ay0)^2 + (az-az0)^2);

  if (amplitude < stepThreshold) {
    stepDown = true;
  }

  if(amplitude1 < stepThreshold){
    stepDown = true;
  }

  if(amplitude2 < stepThreshold){
    stepDown = true;
  }

  if ((amplitude >= stepThreshold) && stepDown) {
    stepDown = false;
    steps++; 
  }

  if ((amplitude1 >= stepThreshold) && stepDown) {
    stepDown = false;
    steps++; 
  }

  if ((amplitude2 >= stepThreshold) && stepDown) {
    stepDown = false;
    steps++; 
  }
  
    Serial.print("\t");
    Serial.print("\t");
    Serial.print("\t");
    Serial.print("\t");
    Serial.print("\t");
    Serial.println("Step count:" + String(steps));
 
}

void sendSteps(){

if (WiFi.status() == WL_CONNECTED) { //Check WiFi connection status
    
  StaticJsonBuffer<200> JSONbuffer; //Declaring static JSON buffer
  JsonObject& JSONencoder = JSONbuffer.createObject();
  
  JSONencoder["arduinoid"] = "esp1";
  JSONencoder["sessionSteps"] = steps;
  
  char JSONmessageBuffer[300];
  JSONencoder.prettyPrintTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));
  Serial.println(JSONmessageBuffer);
  HTTPClient http; //Declare object of class HTTPClient
  http.begin("http://itsovy.sk:1203/sendsteps"); //Specify request destination
  http.addHeader("Content-Type", "application/json");
  int httpCode = http.POST(JSONmessageBuffer); //Send the request
  String payload = http.getString(); //Get the response payload
  
  Serial.println(httpCode); //Print HTTP return code
  Serial.println(payload); //Print request response payload
  
  http.end(); //Close connection
}
else {
  Serial.println("Error in WiFi connection");
  }
  delay(10000); //Send a request every 5 minutes
}
