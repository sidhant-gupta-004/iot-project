const pubnub = require('pubnub');


/* Simulator Constructor */
function Simulator(brokerURI,clientId,socket){
    var self = this;
    this.client = new pubnub({publishKey:'pub-c-957647d4-c417-4a35-969f-95d00a04a33f',subscribeKey:'sub-c-0bbe0cb0-e2b6-11e8-a575-5ee09a206989'});
    self.client.addListener({
        status: self.onConnect.bind(self),
        message: self.onMessage.bind(self)
    })
    self.client.subscribe({
        channels:['sensor/threshold/change','sensor/threshold/show','sensor/buzzer/on']
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
        console.log("Connection failed..",statusEvent.category);
    }
    
}

Simulator.prototype.onMessage = function(message){
    var self = this;
    let channel = message.channel;
    let content = message.content;
    switch(channel){
        case 'sensor/threshold':
            return self.handleThreshold(content);
        case 'sensor/buzzer':
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
            channel:['sensor/threshold']
        },promiseReject);
    }else if (message.type = 'change'){
        self.threshold = message.thresholdValue;
        self.client.publish({
            message:{
                type: 'changeSuccess',
                thresholdValue:self.threshold
            },
            channel:['sensor/threshold']
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


