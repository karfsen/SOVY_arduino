#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>

void setup() {
Serial.begin(115200); //Serial connection
WiFi.begin("PCKLUB", "p4ssl3npr3pcklub"); //WiFi connection
while (WiFi.status() != WL_CONNECTED) { //Wait for the WiFI connection completion
delay(500);
Serial.println("Waiting for connection");
}
}

void loop() {
if (WiFi.status() == WL_CONNECTED) { //Check WiFi connection status
StaticJsonBuffer<200> JSONbuffer; //Declaring static JSON buffer
JsonObject& JSONencoder = JSONbuffer.createObject();
JSONencoder["arduinoid"] = "esp1";
JSONencoder["sessionSteps"] = 117;
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

} else {
Serial.println("Error in WiFi connection");
}
delay(30000); //Send a request every 30 seconds
}
