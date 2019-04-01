#include <Wire.h>
#include <I2Cdev.h>
#include <MPU6050.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <SimpleList.h>

#define stepThreshold 40

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

unsigned long startMillis;
unsigned long currentMillis;
const unsigned long period = 60000;

SimpleList<int> *myList = new SimpleList<int>();
int theSize = myList->size();

void setup()
{
//"MilosHot", "1234567890"
  Serial.begin(115200);
  WiFi.begin("MilosHot", "1234567890"); 

  Wire.begin(sda, scl);
  Serial.begin(115200);

  while(WiFi.status() != WL_CONNECTED) { 
    if(WiFi.status() == WL_CONNECTED){
      int myObject;
      myObject = myList->get(myObject);
      steps = myObject;
      sendSteps();
      steps = 0;
      delay(3000);
    }
    delay(1200);
    Serial.println("Waiting for connection");

if(WiFi.status() == WL_CONNECTED){
      int myObject;
      myObject = myList->get(myObject);
      steps = myObject;
      sendSteps();
      steps = 0;
      delay(3000);
    }

    delay(500);

//      mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);

  }

  Serial.println("");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  Serial.println("Initialize MPU");
  mpu.initialize();
  Serial.println(mpu.testConnection() ? "Connected" : "Connection failed");
  
}

void loop() {

  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);

  delay(900);

  currentMillis = millis();  

  readSteps();

  if (currentMillis - startMillis >= period)
  {

    sendSteps();
    steps = 0;
    startMillis = currentMillis;  
    
  }
}

void readSteps() {

  int stepGo = 125;
  int stepHold = 120;
  int stepHold1 = 130;

  float amplitude;

  amplitude = sqrt((abs((ax - ax0) + (ay - ay0))));


  Serial.println();
  Serial.println(amplitude);

    if((amplitude < stepHold1 && amplitude > stepHold) &&stepDown) {
      stepDown = true;
    }

  if(amplitude > stepThreshold && amplitude < stepGo) {
    stepDown = false;
    steps++;
  }

  Serial.println("Step count:" + String(steps));

}

void sendSteps() {

  if (WiFi.status() == WL_CONNECTED) { 

    StaticJsonBuffer<200> JSONbuffer; 
    JsonObject& JSONencoder = JSONbuffer.createObject();

    JSONencoder["arduinoid"] = "esp1";
    JSONencoder["sessionSteps"] = steps;

    char JSONmessageBuffer[300];
    JSONencoder.prettyPrintTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));
    Serial.println(JSONmessageBuffer);
    HTTPClient http; 
    http.begin("http://itsovy.sk:1203/sendsteps"); 
    http.addHeader("Content-Type", "application/json");
    int httpCode = http.POST(JSONmessageBuffer); 
    String payload = http.getString(); 

    Serial.println(httpCode); 
    Serial.println(payload); 

    http.end();
  }
  else {
    Serial.println("Error in WiFi connection");
  }
}
