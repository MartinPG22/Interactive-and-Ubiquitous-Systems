const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);

// Ruta inicial para servir archivos estáticos del directorio "www"
app.use('/',express.static(path.join(__dirname, 'www')));

let socketUI;

io.on('connection', (socket) => {
  console.log(`socket connected ${socket.id}`);
  // Manejar evento cuando un cliente se conecta

  socket.on("CLIENT_CONNECTED", () => {
    socket.emit("ACK_CONNECTION");
    console.log("CLIENTE CONECTADO");
  });

  socket.on("SERVER_READY", () => {
    socketUI = socket;
    socketUI.emit("ACK_CONNECTION");
    console.log("SERVER READY");
  });

  socket.on("CAMBIAR-INSTRUMENTO", () => {
    if (socketUI) {
        socketUI.emit("CAMBIAR-INSTRUMENTO-UI");
    }
  });

  socket.on("ELIMINAR-DIV", () => {
    if (socketUI) {
        socketUI.emit("ELIMINAR-DIV-UI");
    }
  });

  socket.on("PALABRA_COMPRAR", () => {
    if (socketUI) {
      socketUI.emit("RECARGAR_CARRITO");
    }
  });

  socket.on("PALABRA_FAVORITOS", () => {
    if (socketUI) {
      socketUI.emit("ABRIR_FAVORITOS");
    }
  });
  socket.on("PALABRA_CESTA", () => {
    if (socketUI) {
      socketUI.emit("ABRIR_CESTA");
    }
  });

  socket.on("AUDIO-RECONOCIDO", () => {
    if (socketUI) {
      socketUI.emit("FLAUTA-RECONOCIDA");
    }
  });

  socket.on("CAMARA-RECONOCIDA", () => {
    console.log("FLAUTA RECONOCIDA");
    if (socketUI) {
      socketUI.emit("FLAUTA-RECONOCIDA-CAMARA");
    }
  });

  socket.on("CAMARA-RECONOCIDA-TAMBOR", () => {
    if (socketUI) {
      console.log("TAMBOR RECONOCIDO");
      socketUI.emit("TAMBOR-RECONOCIDO-CAMARA");
    }
  });

  socket.on("FAVORITO-SELECCIONADO", () => {
    if (socketUI) {
      socketUI.emit("AÑADIR-A-FAV");
    }
  });

  socket.on("CESTA-SELECCIONADO", () => {
    if (socketUI) {
      socketUI.emit("AÑADIR-A-CESTA");
    }
  });

  socket.on("CESTA-NO-SELECCIONADO", () => {
    if (socketUI) {
      console.log("funsiona");
      socketUI.emit("NO-AÑADIR-A-CESTA");
    }
  });

  socket.on("ORDEN-MENOR-MAYOR", () => {
    if (socketUI) {
      socketUI.emit("CAMBIAR-ORDEN-MENOR-MAYOR");
    }
  });
  socket.on("ORDEN-MAYOR-MENOR", () => {
    if (socketUI) {
      socketUI.emit("CAMBIAR-ORDEN-MAYOR-MENOR");
    }
  });

});

server.listen(3000, () => {
  console.log("Server listening...");
});