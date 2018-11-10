const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const sensor = require('./deviceSimulator');
const publishKey = process.env.publishKey || 'pub-c-957647d4-c417-4a35-969f-95d00a04a33f';
const subscribeKey = process.env.subscribeKey || 'sub-c-0bbe0cb0-e2b6-11e8-a575-5ee09a206989'; 
const controller = require('./deviceController');
const PORT = process.env.PORT || 3000;
const _ = require('underscore');




app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
});


io.on('connection',function(socket){
    socket.send('Trying to connect to device...');
    let controllerObject = new controller(publishKey,subscribeKey,socket);
    let sensorObject = new sensor(publishKey,subscribeKey,socket);
    socket.on('disconnect',function(){
        delete sensorObject;
        delete controllerObject;
    });

    socket.on('Command',function(message){
        let words = message.split(' ')
        let number = _.find(words,function(word){
            return parseInt(word,10); 
        });
        console.log(number);
        if(_.contains(words,"threshold") && _.contains(words,"show")){
            socket.send('Fetching threshold value from device..');
            controllerObject.showThreshold();
            
        }
        else if(_.contains(words,"threshold") && _.contains(words,"change") && number){
            socket.send('Changing threshold value in device to '+number+'....');
            controllerObject.changeThreshold(parseInt(number,10));
        }
        else{
            socket.send('Invalid Command..');
        }
    });
    
});



http.listen(PORT,function(){
    console.log('Server Started at PORT: '+PORT);
});