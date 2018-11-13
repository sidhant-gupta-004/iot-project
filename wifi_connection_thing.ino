#include <ESP8266WiFi.h>

//needed for library
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include "WiFiManager.h"


String pub_key = "pub-c-957647d4-c417-4a35-969f-95d00a04a33f";
String sub_key = "sub-c-0bbe0cb0-e2b6-11e8-a575-5ee09a206989";
String timestamp;


String urlencode(String str)
{
    String encodedString="";
    char c;
    char code0;
    char code1;
    char code2;
    for (int i =0; i < str.length(); i++){
      c=str.charAt(i);
      if (c == ' '){
        encodedString+= '+';
      } else if (isalnum(c)){
        encodedString+=c;
      } else{
        code1=(c & 0xf)+'0';
        if ((c & 0xf) >9){
            code1=(c & 0xf) - 10 + 'A';
        }
        c=(c>>4)&0xf;
        code0=c+'0';
        if (c > 9){
            code0=c - 10 + 'A';
        }
        code2='\0';
        encodedString+='%';
        encodedString+=code0;
        encodedString+=code1;
        //encodedString+=code2;
      }
      yield();
    }
    return encodedString;
    
}



void configModeCallback (WiFiManager *myWiFiManager) {
  Serial.println("Entered config mode");
  Serial.println(WiFi.softAPIP());
  //if you used auto generated SSID, print it
  Serial.println(myWiFiManager->getConfigPortalSSID());
}

void setup() {
  
  Serial.begin(115200);
  
  //WiFiManager
  
  WiFiManager wifiManager;
  
  
  //reset settings - for testing
  wifiManager.setAPCallback(configModeCallback);

  Serial.println("Kuchh ho raha hai.");
  if(!wifiManager.autoConnect()) {
    Serial.println("failed to connect and hit timeout");
    
    ESP.reset();
    delay(1000);
  } 

  Serial.println("Connected to WiFi");

  timestamp = "0";

  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH);
 
}


String publish_request (String channel, String msg, String signature, String callback)
{
  HTTPClient http;
  
  //publish wala code
  String Link = "http://pubsub.pubnub.com/publish/";//pub-c-957647d4-c417-4a35-969f-95d00a04a33f/sub-c-0bbe0cb0-e2b6-11e8-a575-5ee09a206989/0/test/0/%22Hello%20World%22";
  Link += pub_key + "/" + sub_key;  // {publish_key}/{subscribe_key}
  Link += "/" + signature + "/";    // {signature}
  Link += channel + "/";            // {channel_name}
  Link += callback + "/";          // {callback_function}
  Link += msg;                      // {message}
  //Serial.println(Link);
  
  
  http.begin(Link);     //Specify request destination
  
  int httpCode = http.GET();            //Send the request
  String payload = http.getString();    //Get the response payload

  Serial.println(httpCode);   //Print HTTP return code
  Serial.println(payload);    //Print request response payload

  http.end();  //Close connection

  return payload;
}

String subscribe_request (String channel, String callback)
{
  
  HTTPClient http;
  
  // Subscribe wala code
  String Link = "http://pubsub.pubnub.com/subscribe/";//sub-c-0bbe0cb0-e2b6-11e8-a575-5ee09a206989/threshold/0/" + timestamp;
  Link += sub_key + "/";
  Link += channel;
  Link += "/" + callback + "/";
  Link += timestamp;
  //Serial.println(Link);

  //Serial.println(timestamp);
  http.begin(Link);
  
  int httpCode = http.GET();
  String payload = http.getString();
  Serial.println(payload);

  Serial.println(httpCode);

  int i;
  String ret = "";
  if (httpCode == 200)
  {
    //Serial.println(payload);
    ret = parse_(payload);
    Serial.println(ret);
    
    timestamp = "";
    for (i=0;payload[i]!=']';i++);

    i += 3;
    for (; payload[i]!='"'; i++)
    {
      timestamp += payload[i];
    }
  }

  http.end();
  
  return ret;

}

String parse_ (String input)
{
  if (input[2] == ']')
  {
    return input;
  }
  int i;
  for (i=0; input[i]!=':'; i++);
  i += 2;

  String ret;
  for (;input[i]!='"';i++)
  {
    ret += input[i];
  }

  return ret;
}


void light_jala_mc (String channel, String callback)
{
  String instruction = subscribe_request(channel, callback);

  if (instruction == "LED ON")
  {    
    
    digitalWrite(LED_BUILTIN, LOW);
    Serial.println("Instruction: LED On");  // turn the LED off by making the voltage LOW
    delay(1000);
    
    publish_request (channel, urlencode("{\"message\":\"Done\"}"), "0", "0");
  }
  else if (instruction == "LED OFF")
  {
    
    digitalWrite(LED_BUILTIN, HIGH);
    Serial.println("Instruction: LED Off"); // turn the LED off by making the voltage LOW
    delay(1000);
    
    publish_request (channel, urlencode("{\"message\":\"Done\"}"), "0", "0");
  }
}

void loop ()
{
  
  //publish_request("test", "%22Hello%20World%22", "0", "0");
  //delay(1000);
  //subscribe_request("connected", "0");

  light_jala_mc("LED", "0");
  
  //delay(1000);  // 1 second interval between each new round

}
