const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);

// Limitar el número máximo de oyentes del servidor a 1
server.setMaxListeners(1);

const io = require('socket.io')(server);

// Ruta inicial para servir archivos estáticos del directorio "www"
app.use(express.static(path.join(__dirname, 'www')));

let clientSocket;

io.on('connection', (socket) => {
  console.log(`socket connected ${socket.id}`);
  // Manejar evento cuando un cliente se conecta
  socket.on("CLIENT_CONNECTED", () => {
    clientSocket = socket;
    clientSocket.emit("ACK_CONNECTION");
  });
  
});

server.listen(3000, () => {
  console.log("Server listening...");
});