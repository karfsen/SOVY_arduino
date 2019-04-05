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

MPU6050 mpu;

LiquidCrystal_I2C lcd(0x27, 16, 2);

const uint8_t scl = 14; //D5
const uint8_t sda = 12; //D6

int16_t ax, ay, az;
int16_t gx, gy, gz;

int steps = 0;

boolean stepDown = false;

unsigned long startMillis;
unsigned long currentMillis;
const unsigned long period = 10000;

double gvector2 = 30;
double avector2 = 125;

double avector;
double gvector;

void setup(){
  
    Serial.begin(115200);
    WiFi.begin("GL-EDU", "gl.edu.123!");

    Wire.begin(sda, scl);
  
    Serial.println("");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
  
    Serial.println("Initialize MPU");
    mpu.initialize();
    Serial.println(mpu.testConnection() ? "Connected" : "Connection failed");

  //    Wire.begin(D2,D1);
  //    lcd.begin(16,2);
  //    lcd.init();
    
  //    lcd.backlight();
    
  //    lcd.setCursor(5, 0);
  //    lcd.print("Hello;");
  //  
  //    lcd.setCursor(6, 1);
  //    lcd.print(":-)");
  //  
  //    delay(3000);
    
  //    lcd.clear();
  
  }

void loop() {

    currentMillis = millis();
  
    readSteps();
    
  //  lcd.setCursor(0, 0);
  //  lcd.print("Arduinoid:esp1;");
  //  lcd.setCursor(0, 1);
  //  lcd.print("Your steps: ");
  //  lcd.print(steps);
    
    if (currentMillis - startMillis >= period)
    {
  
  //    sendSteps();
  
  //    lcd.clear();
  //    lcd.setCursor(0, 0);
  //    lcd.print("Since begin");
  //  
  //    lcd.setCursor(5, 1);
  //    lcd.print(steps);
  
  //    steps = 0;
      startMillis = currentMillis;  
      
    }
}

////////////////////////////FUNCTIONS////////////////////////////

void readSteps() {

    mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
  
    avector = sqrt((ax * ax) + (ay * ay) + (az * az));
  
    gvector = sqrt((gx * gx) + (gy * gy) + (gz * gz ));
  
    static double afilta = 1.0;
    avector = 0.995 * afilta + 0.005 * avector;
  
    static double gfilta = 1.0;
    gvector = 0.995 * gfilta + 0.005 * gvector;
  
    gvector = (int) gvector;
    avector = (int) avector;
    
    Serial.println();
    Serial.print("avector ");
    Serial.print(avector);
    
    Serial.print(" ");
    Serial.print("gvector ");
    Serial.print(gvector);
    
    if(gvector > gvector2){
      if(avector > avector2){
        
        steps++;
        gvector = 0;
        avector = 70;
        
        Serial.print(" ");
        Serial.println("Step count:" + String(steps));
      }
    }
    
//    Serial.print(" ");
//    Serial.print("Step count:" + String(steps));

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
