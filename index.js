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
  

  // Manejar evento cuando se detecta la palabra "comprar"
  /*socket.on("PALABRA_COMPRAR", () => {
    console.log("Se recibió la señal para comprar desde el cliente");
    io.emit("RECARGAR_CARRITO");
  });*/
});


// Ruta inicial para servir archivos estáticos
app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  // Manejar evento cuando se recibe la señal de comprar desde el cliente
  socket.on("PALABRA_COMPRAR", () => {
    console.log("Se recibió la señal para comprar desde el cliente");
    // Emitir señal para recargar la página del servidor
    io.emit("RECARGAR_PAGINA_SERVIDOR");
  });
});

server.listen(3000, () => {
  console.log("Server listening...");
});