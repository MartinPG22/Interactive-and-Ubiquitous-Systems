// Conexión con el servidor a través de Socket.IO
var socket = io();

// Emitir evento CLIENT_CONNECTED cuando el cliente se conecta
console.log("Enviando");
socket.emit("CLIENT_CONNECTED");

// Manejar evento ACK_CONNECTION del servidor
socket.on("ACK_CONNECTION", function() {
  console.log("Conexión establecida con el servidor");
  // UNA VEZ ESTABLECIDA LA CONEXIÓN...
});

// Obtenemos referencias a los elementos que necesitamos manipular
const pantallaPrincipal = document.getElementById("pantalla-principal");
const escaneandoSonido = document.getElementById("escaneando-sonido");
const botonSonido = document.getElementById("boton-sonido");
const botonRetroceder = document.getElementById("boton-retroceder");
const botonRetrocederMapa = document.getElementById("boton-retroceder-mapa");
const mapa = document.getElementById("mostrar-mapa");
const botonMapa = document.getElementById("boton-mapa");
const botonCentrarMapa = document.getElementById("boton-centrar-mapa");

// Ocultamos la sección de escaneando sonido al cargar la página
escaneandoSonido.style.display = "none";

// Ocultar el mapa al cargar la página
mapa.style.display = "none";

// Inicializar el mapa
let mymap = null;

// Función para manejar el evento táctil en el botón de sonido
botonSonido.addEventListener("touchstart", function() {
  pantallaPrincipal.style.display = "none";
  escaneandoSonido.style.display = "block";
});

// Función para manejar el evento táctil en el botón de retroceso
botonRetroceder.addEventListener("touchstart", function() {
  pantallaPrincipal.style.display = "block";
  escaneandoSonido.style.display = "none";
});

// Función para manejar el evento táctil en el botón de retroceso en el mapa
botonRetrocederMapa.addEventListener("touchstart", function() {
  pantallaPrincipal.style.display = "block";
  mapa.style.display = "none";
});

// Función para manejar el evento táctil en el botón de mapa
botonMapa.addEventListener("touchstart", function() {
  mapa.style.display = "block"; // Mostrar el contenedor del mapa
  pantallaPrincipal.style.display = "none"; // Ocultar pantalla principal
  escaneandoSonido.style.display = "none";
});

// Definir el ícono personalizado
var customIcon = L.icon({
  iconUrl: '../images/marcador.png', // Ruta de la imagen del marcador
  iconSize: [32, 32], // Tamaño de la imagen del marcador
  iconAnchor: [16, 32], // Punto de anclaje del marcador (la parte superior del marcador)
  popupAnchor: [0, -32] // Punto de anclaje del popup (la parte superior del popup)
});

// Coordenadas dentro de Leganés, Madrid
var coordenadasLeganés = [
  [40.326051, -3.767016], 
  [40.324418, -3.771063], 
  [40.412141, -3.708214],
  [40.478182, -3.712631], 
  [40.357384, -3.845619],
  [40.540404, -3.651862],
  [40.625525, -3.647489],
  [40.543795, -3.641711],
  [40.323989, -3.867142] 
];

// Función para agregar marcadores en coordenadas dentro de Leganés
function agregarMarcadoresEnLeganés() {
  coordenadasLeganés.forEach(function(coordenada) {
    L.marker(coordenada).addTo(mymap);
  });
}

// Variable para almacenar el marcador
var marker;

// Función para manejar el evento táctil en el botón de mapa
botonMapa.addEventListener("touchstart", function() {
  mapa.style.display = "block"; // Mostrar el contenedor del mapa
  pantallaPrincipal.style.display = "none"; // Ocultar pantalla principal

  // Inicializar el mapa solo si no está inicializado
  if (!mymap) {
    // Obtener ubicación del dispositivo y centrar el mapa en las coordenadas del usuario
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var latlng = [position.coords.latitude, position.coords.longitude];
        mymap = L.map('map').setView(latlng, 15); // Centra el mapa en las coordenadas del usuario

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
          maxZoom: 18
        }).addTo(mymap);

        // Eliminar los controles de zoom predeterminados
        mymap.removeControl(mymap.zoomControl);

        // Crear un nuevo control de zoom
        var customZoomControl = L.control.zoom();

        // Establecer la posición personalizada del control de zoom
        customZoomControl.setPosition('topright');

        // Agregar el control de zoom personalizado al mapa
        customZoomControl.addTo(mymap);

        agregarMarcadoresEnLeganés();

        // Crear el marcador en las coordenadas del usuario
        marker = L.marker(latlng, { icon: customIcon }).addTo(mymap);

        // Actualizar la posición del marcador continuamente
        navigator.geolocation.watchPosition(function(position) {
        var latlng = [position.coords.latitude, position.coords.longitude];
        
        // Actualizar la posición del marcador
        marker.setLatLng(latlng);

        });
      });
    } else {
      alert("La geolocalización no está disponible en este navegador.");
    }
  }
});

// Función para manejar el evento de clic en el botón para centrar el mapa
botonCentrarMapa.addEventListener("touchstart", function() {
  // Verificar si el marcador está definido
  if (marker) {
    // Obtener las coordenadas actuales del marcador
    var latlng = marker.getLatLng();
    
    // Centrar el mapa en las coordenadas actuales del marcador con un poco de zoom
    mymap.setView(latlng, 15); // Aquí puedes ajustar el nivel de zoom según tu preferencia
  } else {
    alert("El marcador no está definido.");
  }
});

document.getElementById('ayuda').addEventListener('click', function() {
  var popup = document.getElementById('ayuda-popup');
  if (popup.style.display === 'none' || popup.style.display === '') {
      popup.style.display = 'block';
  } else {
      popup.style.display = 'none';
  }
});

