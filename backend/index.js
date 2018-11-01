const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;


let clients = 0;

app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
});


io.on('connection',function(socket){
    clients++;
    socket.send('Welcome to SocketIO there are currently '+clients+' Users connected');
    socket.broadcast.emit('userConnect',clients);
    socket.on('disconnect',function(){
        clients--;
        io.emit('userDisconnect',clients);
    });
    socket.on('Chat',function(msg){
        socket.broadcast.emit('Chat',msg);
    });

});

http.listen(PORT,function(){
    console.log('Server Started at PORT: '+PORT);
});