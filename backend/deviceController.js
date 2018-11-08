const express = require('express');
const pubnub = require('pubnub');
let sensorConnected = false
/* Controller Constructor */
function Controller(brokerURI,clientId,socket){
    var self = this;
    self.client = new pubnub({publishKey:'pub-c-957647d4-c417-4a35-969f-95d00a04a33f',subscribeKey:'sub-c-0bbe0cb0-e2b6-11e8-a575-5ee09a206989'});
    self.client.addListener({
        status: self.onConnect.bind(self),
        message: self.onMessage.bind(self)
    });
    self.client.subscribe({
        channels:['sensor/connected','sensor/threshold/show','sensor/abnormality','sensor/threshold/change']
    });
    self.socket = socket;
    console.log('Controller created..');
}

Controller.prototype.onConnect = function(statusEvent){
    /* Write all the publishers and subscribers for the topic over here */
    var self = this;
    if(statusEvent.category === "PNConnectedCategory"){
        console.log('Controller connection to PubNub established');
        /* Write all the publishers and subscribers for the topic over here */
        
    }else{
        console.log("Connection failed..",statusEvent.category);
    }
}
    


Controller.prototype.onMessage = function(message){
   var self = this;
   let channel = message.channel;
   let content = message.message;
   switch(channel){
        case 'sensor/connected':
            return self.handleSensorConnected(content);
        case 'sensor/abnormality':
            return self.handleAbnormality(content);
        case 'sensor/threshold':
            return self.handleThreshold(content);
       
   }
}



Controller.prototype.handleSensorConnected = function(message){
    var self = this;
    let sensorConnected = (message.connected == 'true');
    if(sensorConnected){
        self.socket.send('Device connected successfully!');
    }
    else{
        self.socket.send('Failed to connect to remote device');
    }
}

Controller.prototype.handleAbnormality = function(message){
    var self = this;
    self.socket.send('Abnormal temperature detected!');
}

Controller.prototype.handleThreshold = function(mesage){
    if(message.type == 'showValue'){
        self.socket.send("Current Threshold value: " + message.thresholdValue);
    }
    else if(message.type == 'changeSuccess'){
        self.socket.send('Threshold value changed Successfully new threshold value: ' + message.thresholdValue);
    }
}

Controller.prototype.changeThreshold = function(thresholdValue){
    var self = this;
    self.client.publish({
        message:{
            type:'change',
            thresholdValue:thresholdValue
        },
        channel:['sensor/threshold']
    },promiseReject);
}

Controller.prototype.showThreshold = function(){
    var self = this;
    self.client.publish({
        message:{
            type:'show'
        },
        channel:['sensor/threshold']
    },promiseReject);
}

Controller.prototype.onBuzzer = function(buzzerState){
    var self = this;
    self.client.publish({
        message:{
            state:buzzerState
        },
        channel:['sensor/buzzer']
    },promiseReject);
}


function promiseReject(status,response){
    if(status.error){
        console.log("Error Occured while publishing from contoller");
    }
    else{
        console.log("Successfully published from controller")
    }
}


module.exports = Controller;



