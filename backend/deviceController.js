const express = require('express');
const pubnub = require('pubnub');
let sensorConnected = false
/* Controller Constructor */
function Controller(publishKey,subscribeKey,socket){
    var self = this;
    self.cloudConnected  = false;
    self.client = new pubnub({publishKey:publishKey,subscribeKey:subscribeKey});
    self.client.addListener({
        status: self.onConnect.bind(self),
        message: self.onMessage.bind(self)
    });
    self.client.subscribe({
        channels:['sensor/connected','sensor/threshold/showValue','sensor/abnormality','sensor/threshold/changeSuccess']
    });
    self.socket = socket;
    console.log('Controller created..');
}



Controller.prototype.onConnect = function(statusEvent){
    /* Write all the publishers and subscribers for the topic over here */
    var self = this;
    if(statusEvent.category === "PNConnectedCategory"){
        self.cloudConnected = true;
        console.log('Controller connection to PubNub established');
       
       
        /* Write all the publishers and subscribers for the topic over here */
        
    }else{
        
    }
}
    


Controller.prototype.onMessage = function(message){
   var self = this;
   let channel = message.channel.split('/')[1];
   let content = message.message;
   console.log(channel,content,"Controller");
   switch(channel){
        case 'connected':
            return self.handleSensorConnected(content);
        case 'abnormality':
            return self.handleAbnormality(content);
        case 'threshold':
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

Controller.prototype.handleThreshold = function(message){
    var self = this;
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
        channel:['sensor/threshold/change']
    },promiseReject);
}

Controller.prototype.showThreshold = function(){
    var self = this;
    self.client.publish({
        message:{
            type:'show'
        },
        channel:['sensor/threshold/show']
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



