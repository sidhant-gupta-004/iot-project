const pubnub = require('pubnub');
const Promise = require('bluebird');
/* Simulator Constructor */
function Simulator(publishKey,subscribeKey,socket){
    var self = this;
    this.client = new pubnub({publishKey:publishKey,subscribeKey:subscribeKey});
    self.client.addListener({
        status: self.onConnect.bind(self),
        message: self.onMessage.bind(self)
    })
    self.client.subscribe({
        channels:['sensor/threshold/show','sensor/buzzer','sensor/threshold/change']
    });
    self.socket = socket;
    self.threshold = 82;
    self.buzzerState = 'off';
    console.log('Simulator created..');
}

Simulator.prototype.onConnect = function(statusEvent){
    var self = this;
    if(statusEvent.category === "PNConnectedCategory"){
        console.log('Simulator connection to PubNub established');
        /* Write all the publishers and subscribers for the topic over here */
        self.client.publish({
            message:{
                connected:'true'
            },
            channel:'sensor/connected'
        },promiseReject);
    }else{
       
    }
    
}

Simulator.prototype.onMessage = function(message){
    var self = this;
    let channel = message.channel.split('/')[1];
    let content = message.message;
    console.log(channel,content,"Simulator");
    switch(channel){
        case 'threshold':
            return self.handleThreshold(content);
        case 'buzzer':
            return self.handleBuzzer(content);
    }
    
}

Simulator.prototype.handleThreshold = function(message){
    var self = this;
    if(message.type == 'show'){
        self.client.publish({
            message:{
                type: 'showValue',
                thresholdValue: self.threshold
            },
            channel:['sensor/threshold/showValue']
        },promiseReject);
    }else if (message.type == 'change'){
        self.threshold = message.thresholdValue;
        self.client.publish({
            message:{
                type: 'changeSuccess',
                thresholdValue:self.threshold
            },
            channel:['sensor/threshold/changeSuccess']
        },promiseReject);
    }
   
}

Simulator.prototype.handleBuzzer  = function(message){
    var self = this;
    if(message.state = 'on'){
        self.client.publish({
            message:{
                
            }
        },promiseReject)
    }
}

function promiseReject(status,response){
    if(status.error){
        console.log("Error Occured while publishing from simulator");
    }
    else{
        console.log("Successfully published from simulator")
    }
}
module.exports = Simulator;


