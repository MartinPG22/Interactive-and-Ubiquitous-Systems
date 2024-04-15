// Conexión con el servidor a través de Socket.IO
const socket = io();

socket.on("connect", () => {
  socket.emit("CLIENT_CONNECTED");

  // Manejar evento ACK_CONNECTION del servidor
  socket.on("ACK_CONNECTION", function() {
    console.log("Conexión establecida con el servidor");
  });

});


/*socket.on("RECARGAR_CARRITO", function() {
  console.log("Recargando el carrito...");
  // Hacer una petición al servidor para recargar la página del servidor
  fetch('http://localhost:3000/', { method: 'GET' })
    .then(response => {
      if (response.ok) {
        console.log('Página del servidor recargada con éxito');
      } else {
        console.error('Error al recargar la página del servidor');
      }
    })
    .catch(error => {
      console.error('Error al recargar la página del servidor:', error);
    });
});*/

// Obtenemos referencias a los elementos que necesitamos manipular
const pantallaPrincipal = document.getElementById("pantalla-principal");
const escaneandoSonido = document.getElementById("escaneando-sonido");
const botonSonido = document.getElementById("boton-sonido");
const botonRetroceder = document.getElementById("boton-retroceder");
const botonRetrocederMapa = document.getElementById("boton-retroceder-mapa");
const mapa = document.getElementById("mostrar-mapa");
const botonMapa = document.getElementById("boton-mapa");
const botonCentrarMapa = document.getElementById("boton-centrar-mapa");

const escaneandoCamara = document.getElementById("escaneando-imagen");
const botonCamara = document.getElementById("boton-camara");
const botonRetrocederCamara = document.getElementById("boton-retroceder-camara");

// Ocultamos la sección de escaneando sonido al cargar la página
escaneandoSonido.style.display = "none";
escaneandoCamara.style.display = "none"; // No se porque no funciona bien, no lo pone a none

// Ocultar el mapa al cargar la página
mapa.style.display = "none";

// Inicializar el mapa
let mymap = null;

// Función para manejar el evento táctil en el botón de sonido
botonSonido.addEventListener("touchstart", function() {
  pantallaPrincipal.style.display = "none";
  escaneandoSonido.style.display = "block";
  escaneandoCamara.style.display = "none";
});

// Función para manejar el evento táctil en el botón de retroceso
botonRetroceder.addEventListener("touchstart", function() {
  pantallaPrincipal.style.display = "block";
  escaneandoSonido.style.display = "none";
});

// Función para manejar el evento táctil en el botón de camara
botonCamara.addEventListener("touchstart", function() {
  pantallaPrincipal.style.display = "none";
  escaneandoCamara.style.display = "block";
});

// Función para manejar el evento táctil en el botón de retroceso
botonRetrocederCamara.addEventListener("touchstart", function() {
  pantallaPrincipal.style.display = "block";
  escaneandoCamara.style.display = "none";
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
  escaneandoCamara.style.display = "none";
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

document.getElementById('ayuda').addEventListener('touchstart', function() {
  var popup = document.getElementById('ayuda-popup');
  if (popup.style.display === 'none' || popup.style.display === '') {
      popup.style.display = 'block';
  } else {
      popup.style.display = 'none';
  }
});

// Función para manejar la detección de la palabra "comprar"
function reconocerPalabra(palabra) {
  // Verificar si la palabra reconocida es "comprar"
  if (palabra.toLowerCase().includes("comprar")) {
    // Enviar la palabra al servidor
    socket.emit("PALABRA_COMPRAR");
    Swal.fire({
      title: '¡Compra Procesada!',
      text: 'La compra ha sido procesada exitosamente.',
      icon: 'success',
      timer: 5000, // Cerrar automáticamente después de 5 segundos
      timerProgressBar: true,
      toast: true,
      position: 'top',
      showConfirmButton: false
    }).then(() => {
      // Recargar la página después de cerrar la alerta
      //location.reload();
    });
  }
}

// Función para iniciar el reconocimiento de voz
function iniciarReconocimientoVoz() {
  const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
  recognition.lang = 'es-ES';

  recognition.onresult = function(event) {
    const palabra = event.results[0][0].transcript;
    console.log('Palabra reconocida:', palabra);
    reconocerPalabra(palabra);
  }

  recognition.start();
}

// Obtener referencia al botón de grabación
const botonGrabar = document.getElementById("boton-pago");

// Agregar evento al botón para iniciar el reconocimiento de voz
botonGrabar.addEventListener("touchstart", iniciarReconocimientoVoz);


////////////////////////// Reconocimiento de imagenes //////////////////////////

// extraemos la url de nuestro modelo, lo holdea google y funciona 
const URL = "https://teachablemachine.withgoogle.com/models/RZs7GMDB5/";

let model, webcam, labelContainer, maxPredictions;
let predictionsList = []; // Declara una lista para almacenar las predicciones

// Cargamos el modelo y las imágenes
async function init() {
    // Definimos las URLs del modelo y los metadatos
    const modelURL = URL + "model.json"; // URL del archivo model.json
    const metadataURL = URL + "metadata.json"; // URL del archivo metadata.json

    // Cargamos el modelo y los metadatos
    model = await tmImage.load(modelURL, metadataURL); // Cargamos el modelo y los metadatos desde las URLs definidas
    maxPredictions = model.getTotalClasses(); // Obtenemos el número total de clases del modelo

    // Configuramos la cámara web
    const flip = true; // Indica si se debe voltear la cámara web
        webcam = new tmImage.Webcam(200, 200, flip); // Creamos una instancia de la clase Webcam con un tamaño de 200x200 y volteo activado
        await webcam.setup(); // Solicitamos acceso a la cámara web y la inicializamos
        await webcam.play(); // Comenzamos a reproducir el flujo de vídeo de la cámara web
        window.requestAnimationFrame(loop); // Iniciamos el bucle de actualización de la cámara web

    // Añadimos elementos al DOM para mostrar la vista previa de la cámara y las etiquetas de clase
    document.getElementById("webcam-container").appendChild(webcam.canvas); // Añadimos el lienzo de la cámara al contenedor correspondiente en el HTML
    labelContainer = document.getElementById("label-container"); // Obtenemos el contenedor de etiquetas
    for (let i = 0; i < maxPredictions; i++) { // Creamos un div por cada etiqueta de clase
        labelContainer.appendChild(document.createElement("div"));
    }
    // La camara esta siempre activa y se actualiza en cada frame, no se hace una foto como tal. 
}
// La función loop() se llama inicialmente al iniciar el programa, y luego se llama repetidamente a través de window.requestAnimationFrame(loop).
async function loop() {
    webcam.update(); // haces update de la camara
    await predict();
    window.requestAnimationFrame(loop);
    }

    // Realiza una predicción con el modelo Teachable Machine y almacena las predicciones en una lista y las manda al container
async function predict() {
    const prediction = await model.predict(webcam.canvas);
    let predictions = []; // Lista temporal para almacenar las predicciones de este fotograma
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            labelContainer.childNodes[i].innerHTML = classPrediction; // Para meterlo en el container

        predictions.push(classPrediction); // Agrega la predicción a la lista temporal
    }
    predictionsList.push(predictions); // Agrega la lista de predicciones de este fotograma a la lista principal
}

////////////////////// Función Eliminar ///////////////////////////
let sumar = 0; // Variable para mantener la suma de los giros
var giroscopioActivo = false; // Inicialmente desactivado
var gyroscope = null; // Variable global para el objeto gyroscope
var botonEliminar = document.getElementById('eliminar');

// Definir la función toggleGiroscopio fuera de activarGiroscopio
function toggleGiroscopio() {
    if (!giroscopioActivo) {
        botonEliminar.style.backgroundColor = '#bbbbbb';
        activarGiroscopio();
    } else {
      botonEliminar.style.backgroundColor = '';
        desactivarGiroscopio();
    }
    giroscopioActivo = !giroscopioActivo;
}

function activarGiroscopio() {
    sumar = 0;
    var umbralGiro = 5;
    var ultimoBeta = 0;

    gyroscope = new Gyroscope({ frequency: 60 });

    gyroscope.addEventListener('reading', function() {
        var beta = gyroscope.x;

        if (Math.abs(beta - ultimoBeta) > umbralGiro * 1.5) {
            if (beta < umbralGiro) {
                socket.emit("CAMBIAR-INSTRUMENTO");
                sumar += 1;
            }
        }

        ultimoBeta = beta;

        console.log("Suma actual:", sumar);
    });

    gyroscope.start();
    console.log("Detección del giroscopio activada");
}

function desactivarGiroscopio() {
    gyroscope.stop();
    console.log("Detección del giroscopio desactivada");
    socket.emit("ELIMINAR-DIV");
}

// Agregar evento al botón "Eliminar"
document.getElementById('eliminar').addEventListener('touchstart', toggleGiroscopio);


