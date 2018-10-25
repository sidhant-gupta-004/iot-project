//SS1 - Basic Test to check response from wifi module
// Please visit https://create.arduino.cc/projecthub/jeffpar0721/add-wifi-to-arduino-uno-663b9e?f=1
// Screen dump of  Serial port of Arduino is given at the bottom
// extra large delays provided to ensure proper responses.

#include <SoftwareSerial.h>
int serialRx = 2;                          // software serial  RX  TX 
int serialTx = 3;

SoftwareSerial portOne(serialRx, serialTx);

void setup() {
  
  Serial.begin(115200);
  
  while (!Serial) {
    ; // wait for serial port to connect.
  }
    
  portOne.begin(115200);              // Start software serial port
  delay(200);
 
  
  sendToWifi("ATE0",100);                       // set Echo Off. Otherwise echo was ON.
  
  sendToWifi("AT+CWMODE=3",1000);           // Set wifi mode to 3
  sendToWifi("AT+CWMODE?",100);                 // Get Wifi Mode
  
  sendToWifi("AT+CIPSTA?",2000);                // Get IP Address of ESP8266.
  Serial.println("Setup is done!");
  delay(2000);
}

void loop() {
   
}



void sendToWifi(String command, const int timeout){

  String response = "";
  Serial.print("Sent command to ESP8266-E12: ");
  Serial.println(command);
  delay(50);
  portOne.println(command); 
  long int time = millis();
  while( (time+timeout) > millis())
  {
    while(portOne.available())
    { 
      char c = portOne.read(); 
      response+=c;
    }  
  }
 
    Serial.print("Response from ESP8266-E12: ");
    Serial.println(response);
}


