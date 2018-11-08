const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const sensor = require('./deviceSimulator');
const brokerURI = 'mqtt://mqtt.pndsn.com';
const clientId = process.env.CLIENT_ID || 'pub-c-85f4a7a4-bbf4-4327-a3c0-6c868fbde94a/sub-c-c6516ec0-e0b6-11e8-9c95-2a55d2975f76'
const controller = require('./deviceController');
const PORT = process.env.PORT || 3000;





app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
});


io.on('connection',function(socket){
    let sensorObject = new sensor(brokerURI,clientId,socket);
    let controllerObject = new controller(brokerURI,clientId,socket);
    

});



http.listen(PORT,function(){
    console.log('Server Started at PORT: '+PORT);
});