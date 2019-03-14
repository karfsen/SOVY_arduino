#include "Wire.h"
#include "I2Cdev.h"
#include "MPU6050.h"
//#include "Servo.h"
 
//#define SERVOPIN 16

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
 
//Servo myservo;
//int val;
//int prevVal;
// 
void setup()
{
Wire.begin(sda, scl);
Serial.begin(38400);
 
Serial.println("Initialize MPU");
mpu.initialize();
Serial.println(mpu.testConnection() ? "Connected" : "Connection failed");
//myservo.attach(SERVOPIN);
}
 
void loop()
{
mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);

//        Serial.println("\ax:");
//        Serial.print(ax); 
//        Serial.println("\ay:");
//        Serial.print(ay); 
        
 
//val = map(ax, -17000, 17000, 0, 179);
//if (val != prevVal)
//{
//myservo.write(val);
//prevVal = val;
//}

readSteps();

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

//  if ((amplitude2 >= stepThreshold) && stepDown) {
//    stepDown = false;
//    steps++; 
//  }
  
    Serial.print("\t");
    Serial.print("\t");
    Serial.print("\t");
    Serial.print("\t");
    Serial.print("\t");
    Serial.println("Step count:" + String(steps));
 
}
