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
    console.log('Simulator created..');
}

Simulator.prototype.onConnect = function(statusEvent){
    var self = this;
    if(statusEvent.category === "PNConnectedCategory"){
        console.log('connection established..Simulator side..');
        /* Write all the publishers and subscribers for the topic over here */
        self.client.publish({
            message:{
                connected:'true'
            },
            channel:'sensor/threshold/connected'
        },
        function(status,response){
            if(status.error){
                console.log(status);
            }
            else{
                console.log('Connected message published from simulator');
            }
        });
    }
}

Simulator.prototype.onMessage = function(message){
    console.log(message);
}

Simulator.prototype.handleThresholdChange = function(message){
    var self = this;
    self.threshold = message;
    // self.client.publish('sensor/threshold/change','true');
}

Simulator.prototype.handleThresholdShow = function(message){
    // self.client.publish('sensor/threshold/show',self.threshold);
}


module.exports = Simulator;


