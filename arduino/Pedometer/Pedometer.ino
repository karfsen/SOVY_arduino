#include <Wire.h>
#include <I2Cdev.h>
#include <MPU6050.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <SimpleList.h>
#include <LiquidCrystal_I2C.h>
//#include <Adafruit_LiquidCrystal.h>

#define stepThreshold 40

LiquidCrystal_I2C lcd(0x27, 16, 2);

const uint8_t scl = 14; //D5
const uint8_t sda = 12; //D6

MPU6050 mpu;

int16_t ax, ay, az;
int16_t gx, gy, gz;

int ax0 = 0;
int ay0 = 0;
int az0 = 0;

int gx0 = 0;
int gy0 = 0;
int gz0 = 0;

int calcx,calcy;

double ax_calc,ay_calc,az_calc;
double gx_calc,gy_calc,gz_calc;

int steps = 0;

boolean stepDown = false;

unsigned long startMillis;
unsigned long currentMillis;
const unsigned long period = 10000;

SimpleList<int> *myList = new SimpleList<int>();
int theSize = myList->size();

int speeed = 25;
float currentspeed;

void setup()
{
  Serial.begin(115200);
  WiFi.begin("***", "***"); 

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

  }

  Serial.println("");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  Serial.println("Initialize MPU");
  mpu.initialize();
  Serial.println(mpu.testConnection() ? "Connected" : "Connection failed");

//  calibrating();

    Wire.begin(D2,D1);
    lcd.begin(16,2);
    lcd.init();
  
    lcd.backlight();
  
    lcd.setCursor(5, 0);
    lcd.print("Hello;");
  
    lcd.setCursor(6, 1);
    lcd.print(":-)");
  
    delay(3000);
  
    lcd.clear();
}

void loop() {

  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);

  delay(900);

  currentMillis = millis();  

  currentspeed = sqrt((gx - gx0) + (gy - gy0));

  Serial.println();
  Serial.println(currentspeed);

  if(currentspeed > speeed){
  readSteps();
  }

  lcd.setCursor(0, 0);
  lcd.print("Arduinoid:esp1;");
  lcd.setCursor(0, 1);
  lcd.print("Your steps: ");
  lcd.print(steps);
  
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
  
  
  amplitude = sqrt((ax - ax0) + (ay - ay0));

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

//void calibrating(){
//
//Serial.println("Calibrating Accelerometer......");
//  for(calcx=1;calcx<=2000;calcx++)
//  {
//     ax_calc += ax;                      
//     ay_calc += ay;      
//     az_calc += az;
//  }
//  Serial.println("Calibrating Gyroscope......");
//  for(calcy=1;calcy<=2000;calcy++)
//  {
//    gx_calc += gx;                      
//    gy_calc += gy;      
//    gz_calc += gz;
//  }
//  Serial.println("Calibration Done..!!!");                                                         
//}
