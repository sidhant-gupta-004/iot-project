# Real Time Fire Alarm System


## About ( Practical usage )
Fire accidents are not common. But when they take place, they cause great alarm and destruction and sometimes loss of life.This device basically helps detect fire accidents, keep the temperature of the various machines within its threshold limit and anything that requires the temperature to be in control. 

This device turns out to be quite handy as it is accessible to anyone and everyone who need to control and monitor the temperature of their devices along with time to time updates of the condition. Also, its has a significant application in fire detection wherein it gives the temperature values detected by the sensor at regular intervals to the server  which further passes on the message to the user from wherein he/she can control the ringing buzzer and act accordingly


## Technical Description

We have connected the temperature sensor to the ESP8266 Microprocessor using the ADC pin on the board from where the analog voltage values are fetched and converted to Celsius by proper mathematical conversions. This temperature is then further sent to the server. This data is then fetched by the end user. There is a fixed threshold value set above for the device beforehand. If the temperature received at this end is above the set threshold value then the buzzer rings, LED begins to toggle and the user gets an appropriate warning message. On that basis, one can perform the following actions depending on the requirements :

* Set the buzzer off.
* Change the threshold temperature set to the system. 
* Set the blinking LED off. 

The temperature data is periodically sent to the HTTP server implemented for further analysis. 

## Team Members and Contribution

* Abhilash G 
Worked on the Android application to read data to and from the PubNub and provide remote functionality like notification alert, disabling alarm remotely, logs and live temperature feed to the user.

* Gopala Krishnan
Worked on the web client which connected the PubNub server to the web-based frontend hosted using Heroku app.

* Mohit Hudda 
Worked on providing Wifi connection to the ESP.

* Prashant Iyer
Worked on ringing the buzzer and sensing the temperature from the temperature sensor and communicating it to the ESP using ADC.

* Siddhant Gupta 
Worked on connecting ESP to the PubNub server. Wrote publish and subscribe functionality, using HTTP GET requests.

## Demo

Link: https://www.youtube.com/watch?v=xACrICINHx4

web-client: https://fire-system.herokuapp.com
