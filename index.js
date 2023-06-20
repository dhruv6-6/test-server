const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors()); // Configure CORS here

const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: '*',
  },
});

rooms = []

io.on('connection' , (socket) => {

  socket.on('join' , ({room} , callback)=>{
    rooms.push({id:socket.id , room:room}); 

    socket.join(room);

    callback();

  })

  socket.on('info' , (data) =>{
    socket.broadcast.to(data.room).emit('backinfo' , data);
  })

  socket.on('disconnect' , () =>{
    const index = rooms.findIndex((now) => now.id === socket.id);
    rooms.splice(index, 1);
    console.log(`user left `);
  })
})

server.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});