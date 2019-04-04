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

int buffersize=1000;
int acel_deadzone=8;
int giro_deadzone=1;

LiquidCrystal_I2C lcd(0x27, 16, 2);

const uint8_t scl = 14; //D5
const uint8_t sda = 12; //D6

MPU6050 mpu;
MPU6050 accelgyro;

int mean_ax,mean_ay,mean_az,mean_gx,mean_gy,mean_gz,state=0;
int ax_offset,ay_offset,az_offset,gx_offset,gy_offset,gz_offset;

int16_t ax, ay, az;
int16_t gx, gy, gz;

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

float avector;
float gvector;

void setup()
{
  Serial.begin(115200);
  WiFi.begin("GL-EDU", "gl.edu.123!"); 

  Wire.begin(sda, scl);
  Serial.begin(115200);

  while(WiFi.status() != WL_CONNECTED) { 
    if(WiFi.status() == WL_CONNECTED){
      int myObject;
      myObject = myList->get(myObject);
      steps = myObject;
//      sendSteps();
      steps = 0;
      delay(3000);
    }
    delay(1200);
    Serial.println("Waiting for connection");

    delay(500);

  }

  Serial.println("");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  Serial.println("Initialize MPU");
  mpu.initialize();
  Serial.println(mpu.testConnection() ? "Connected" : "Connection failed");

//  calibrating();

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

  accelgyro.setXAccelOffset(0);
  accelgyro.setYAccelOffset(0);
  accelgyro.setZAccelOffset(0);
  accelgyro.setXGyroOffset(0);
  accelgyro.setYGyroOffset(0);
  accelgyro.setZGyroOffset(0);

}

void loop() {
  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);

  avector = sqrt((ax * ax) + (ay * ay) + (az * az));

  gvector = sqrt((gx * gx) + (gy * gy) + (gz * gz ));

  static double afilta = 1.0;
  avector = 0.995 * afilta + 0.005 * avector;

  static double gfilta = 1.0;
  gvector = 0.995 * gfilta + 0.005 * gvector;

  Serial.println();
  Serial.print("avector ");
  Serial.print((int)avector);

  Serial.print(" ");
  Serial.print("gvector ");
  Serial.print((int)gvector);

//  delay(100);

//  if (state==0){
//    Serial.println("\nReading sensors for first time...");
//    meansensors();
//    state++;
//    delay(1000);

//  if (state==1) {
//    Serial.println("\nCalculating offsets...");
//    calibration();
//    state++;
//    delay(1000);
//  }

  currentMillis = millis();  

  currentspeed = sqrt(abs(gx  + gy + gz));
  
//  Serial.println();
//  Serial.print("Speed ");
//  Serial.print(currentspeed);
  
  if(currentspeed > speeed){
  readSteps();
  }

//  lcd.setCursor(0, 0);
//  lcd.print("Arduinoid:esp1;");
//  lcd.setCursor(0, 1);
//  lcd.print("Your steps: ");
//  lcd.print(steps);
  
  if (currentMillis - startMillis >= period)
  {

//    sendSteps();
    steps = 0;
    startMillis = currentMillis;  
    
  }
}

void readSteps() {

  int stepGo = 125;
  int stepHold = 120;
  int stepHold1 = 130;

  float amplitude;
  
//  amplitude = sqrt(abs((ax + ay)));

//  Serial.println();
//  Serial.println(amplitude);

    if((amplitude < stepHold1 && amplitude > stepHold) &&stepDown) {
      stepDown = true;
    }

  if(amplitude > stepThreshold && amplitude < stepGo) {
    stepDown = false;
    steps++;
  }

//  Serial.println("Step count:" + String(steps));

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

void calibration(){
  ax_offset=-mean_ax/8;
  ay_offset=-mean_ay/8;
  az_offset=(16384-mean_az)/8;

  gx_offset=-mean_gx/4;
  gy_offset=-mean_gy/4;
  gz_offset=-mean_gz/4;
  while (1){
    int ready=0;
    accelgyro.setXAccelOffset(ax_offset);
    accelgyro.setYAccelOffset(ay_offset);
    accelgyro.setZAccelOffset(az_offset);

    accelgyro.setXGyroOffset(gx_offset);
    accelgyro.setYGyroOffset(gy_offset);
    accelgyro.setZGyroOffset(gz_offset);

    meansensors();
    Serial.println("...");

    if (abs(mean_ax)<=acel_deadzone) ready++;
    else ax_offset=ax_offset-mean_ax/acel_deadzone;

    if (abs(mean_ay)<=acel_deadzone) ready++;
    else ay_offset=ay_offset-mean_ay/acel_deadzone;

    if (abs(16384-mean_az)<=acel_deadzone) ready++;
    else az_offset=az_offset+(16384-mean_az)/acel_deadzone;

    if (abs(mean_gx)<=giro_deadzone) ready++;
    else gx_offset=gx_offset-mean_gx/(giro_deadzone+1);

    if (abs(mean_gy)<=giro_deadzone) ready++;
    else gy_offset=gy_offset-mean_gy/(giro_deadzone+1);

    if (abs(mean_gz)<=giro_deadzone) ready++;
    else gz_offset=gz_offset-mean_gz/(giro_deadzone+1);

    if (ready==6) break;
  }
}

void meansensors(){
  long i=0,buff_ax=0,buff_ay=0,buff_az=0,buff_gx=0,buff_gy=0,buff_gz=0;

  while (i<(buffersize+101)){
    // read raw accel/gyro measurements from device
    accelgyro.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
    
    if (i>100 && i<=(buffersize+100)){ //First 100 measures are discarded
      buff_ax=buff_ax+ax;
      buff_ay=buff_ay+ay;
      buff_az=buff_az+az;
      buff_gx=buff_gx+gx;
      buff_gy=buff_gy+gy;
      buff_gz=buff_gz+gz;
    }
    if (i==(buffersize+100)){
      mean_ax=buff_ax/buffersize;
      mean_ay=buff_ay/buffersize;
      mean_az=buff_az/buffersize;
      mean_gx=buff_gx/buffersize;
      mean_gy=buff_gy/buffersize;
      mean_gz=buff_gz/buffersize;
    }
    i++;
    delay(2); //Needed so we don't get repeated measures
  }
}

