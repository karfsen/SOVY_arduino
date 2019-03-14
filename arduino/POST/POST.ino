#include <ESP8266WiFi.h>

const char* hostPost = "itsovy.sk"; 

const char *essid="PCKLUB";
const char *key="p4ssl3npr3pcklub";

void postData(String sline) {

   WiFiClient clientPost;
   const int httpPostPort = 1203;

   String urlPost = "/sendsteps";

      Serial.print(">>> Connecting to host: ");
      Serial.println(hostPost);
      
       if (!clientPost.connect(hostPost, httpPostPort)) {
        Serial.print("Connection failed: ");
        Serial.print(hostPost);
      } else {
          clientPost.println("POST " + urlPost + " HTTP/1.1");
          clientPost.print("Host: ");
          clientPost.println(hostPost);
          clientPost.println("User-Agent: ESP8266/1.0");
          clientPost.println("Connection: close");
          clientPost.println("Content-Type: application/x-www-form-urlencoded;");
          clientPost.print("Content-Length: ");
          clientPost.println(sline.length());
          clientPost.println();
          clientPost.println(sline);

          Serial.print("Content Length: ");
          Serial.println(sline.length());
          
          unsigned long timeoutP = millis();
          while (clientPost.available() == 0) {
            
            if (millis() - timeoutP > 10000) {
              Serial.print(">>> Client Timeout: ");
              Serial.println(hostPost);
              clientPost.stop();
              return;
            }
          }

          //just checks the 1st line of the server response. Could be expanded if needed.
          while(clientPost.available()){
            String retLine = clientPost.readStringUntil('\r');
            Serial.println(retLine);
            break; 
          }

      } //end client connection if else
                        
      Serial.print(">>> Closing host: ");
      Serial.println(hostPost);
          
      clientPost.stop();

}

void setup() {

  Serial.begin(115200);
  
      WiFi.begin(essid,key);
  while(WiFi.status() != WL_CONNECTED)
  {
      delay(500);
      Serial.print(".");
  }
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  

}

void loop() {
  
  String dataSend = "arduinoid=esp01&sessionSteps=117";
  postData(dataSend);

  delay(30000);

}
