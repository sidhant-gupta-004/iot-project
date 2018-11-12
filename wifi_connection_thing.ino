#include <ESP8266WiFi.h>          //https://github.com/esp8266/Arduino

//needed for library
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include "WiFiManager.h"          //https://github.com/tzapu/WiFiManager

#define PubNub_BASE_CLIENT WiFiClient
#define PUBNUB_DEFINE_STRSPN_AND_STRNCASECMP
#include <PubNub.h>


const static char pubkey[] = "pub-c-957647d4-c417-4a35-969f-95d00a04a33f";
const static char subkey[] = "sub-c-0bbe0cb0-e2b6-11e8-a575-5ee09a206989";
const static char msg[] = "Hello world!";
const static char channel[] = "sensor/connected";
String timestamp;


void configModeCallback (WiFiManager *myWiFiManager) {
  Serial.println("Entered config mode");
  Serial.println(WiFi.softAPIP());
  //if you used auto generated SSID, print it
  Serial.println(myWiFiManager->getConfigPortalSSID());
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  
  //WiFiManager
  //Local intialization. Once its business is done, there is no need to keep it around
  WiFiManager wifiManager;
  //reset settings - for testing

  wifiManager.setAPCallback(configModeCallback);

  Serial.println("Kuchh ho raha hai.");
  if(!wifiManager.autoConnect()) {
    Serial.println("failed to connect and hit timeout");
    //reset and try again, or maybe put it to deep sleep
    ESP.reset();
    delay(1000);
  } 

  //if you get here you have connected to the WiFi
  Serial.println("connected...yeey :)");

  //int a = 2, b=3;
  //pubnub_init(a,b);
  PubNub.begin(pubkey, subkey);
  Serial.println("PubNub connected");

  timestamp = "0";
 
}

void flash(int ledPin)
{
  /* Flash LED three times. */
  for (int i = 0; i < 3; i++) {
    digitalWrite(ledPin, HIGH);
    delay(100);
    digitalWrite(ledPin, LOW);
    delay(100);
  }
}


/*void loop() {


  
  WiFiClient *client;

  client = PubNub.publish(channel, msg);

  if (!client) {
    Serial.println("publishing error");
    delay(1000);
    return;
  }
  if (PubNub.get_last_http_status_code_class() != PubNub::http_scc_success) {
    Serial.print("Got HTTP status code error from PubNub, class: ");
    Serial.print(PubNub.get_last_http_status_code_class(), DEC);
  }
  while (client->available()) {
    Serial.write(client->read());
  }
  client->stop();
  Serial.println("---");
}*/

void loop ()
{

  HTTPClient http;    //Declare object of class HTTPClient
  
  //publish wala code
  char Link[] = "http://pubsub.pubnub.com/publish/pub-c-957647d4-c417-4a35-969f-95d00a04a33f/sub-c-0bbe0cb0-e2b6-11e8-a575-5ee09a206989/0/hello_world/0/%22Hello%20World%22";
  
  http.begin(Link);     //Specify request destination
  
  int httpCode = http.GET();            //Send the request
  String payload = http.getString();    //Get the response payload

  Serial.println(httpCode);   //Print HTTP return code
  Serial.println(payload);    //Print request response payload

  http.end();  //Close connection

  delay(1000);

  // Subscribe wala code
  String Link_s = "http://pubsub.pubnub.com/subscribe/sub-c-0bbe0cb0-e2b6-11e8-a575-5ee09a206989/hello_world/0/" + timestamp;

  Serial.println(timestamp);
  http.begin(Link_s);
  
  httpCode = http.GET();
  payload = http.getString();

  Serial.println(httpCode);
  Serial.println(payload);

  for (int i=5; payload[i]!='"';i++)
  {
    timestamp += payload[i];
  }

  http.end();
  
  delay(5000);  //5 second interval between each new round

}
