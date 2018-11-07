const express = require('express');
const pubnub = require('pubnub');

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
        console.log('connection established..Controller side..');
        /* Write all the publishers and subscribers for the topic over here */
        
    }
}
    


Controller.prototype.onMessage = function(message){
    console.log(message);
    // switch(topic){
    //     case 'sensor/connected':
    //         return self.handleSensorConnected(message);
    //     case 'sensor/abnormality':
    //         return self.handleAbnormality(message);
    //     case 'sensor/threshold/show':
    //         return self.handleShowThreshold(message);
    //     case 'sensor/threshold/change':
    //         return self.handleChangedThreshold(message);
    // }
}



Controller.prototype.handleSensorConnected = function(message){
    // let sensorConnected = (message.toString() == 'true');
    // if(sensorConnected){
    //     socket.send('Device connected successfully!');
    // }
    // else{
    //     socket.send('Failed to connect to remote device');
    // }
}

Controller.prototype.handleAbnormality = function(message){
    // var self = this;
    // socket.send('Abnormal temperature detected!');
}

Controller.prototype.handleChangedThreshold = function(mesage){
    // var self = this;
    // if(message.toString() === 'true'){
    //     socket.send('Threshold setting changed successfully!');
    // }
    // else{
    //     socket.send('Some error occured in changing threshold setting');
    // }
    
}

Controller.prototype.handleShowThreshold = function(message){
    // socket.send('Current Temperature Threshold setting: '+message.toString());
}

module.exports = Controller;

