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

function reconocerPalabra(palabra) {
  const palabraLowerCase = palabra.toLowerCase();

  // Mapeo de palabras clave a acciones
  const acciones = {
    "comprar": {
      action: "PALABRA_COMPRAR",
      message: "¡Compra Procesada!",
      alertMessage: "La compra ha sido procesada exitosamente.",
      alertType: "success"
    },
    "ordenar menos a más": "ORDEN-MENOR-MAYOR",
    "ordenar menor a mayor": "ORDEN-MENOR-MAYOR",
    "ordenar más a menos": "ORDEN-MAYOR-MENOR",
    "ordenar mayor a menor": "ORDEN-MAYOR-MENOR",
    "ver favoritos": "PALABRA_FAVORITOS",
    "ver mis favoritos": "PALABRA_FAVORITOS",
    "favoritos": "PALABRA_FAVORITOS",
    "ver mi cesta": "PALABRA_CESTA",
    "cesta": "PALABRA_CESTA",
    "ver cesta": "PALABRA_CESTA"
  };

  // Verificar si la palabra está en el mapeo de acciones
  if (palabraLowerCase in acciones) {
    const action = acciones[palabraLowerCase];
    if (typeof action === "string") {
      // Enviar la acción correspondiente al servidor
      socket.emit(action);
    } else {
      // Enviar la acción y mostrar la alerta correspondiente
      socket.emit(action.action);
      mostrarAlerta(action.message, action.alertMessage, action.alertType);
    }
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
const botonCesta = document.getElementById("boton-cesta");
const botonFavs = document.getElementById("boton-favs");

// Agregar evento al botón para iniciar el reconocimiento de voz
botonGrabar.addEventListener("touchstart", iniciarReconocimientoVoz);
botonCesta.addEventListener("touchstart", iniciarReconocimientoVoz);
botonFavs.addEventListener("touchstart", iniciarReconocimientoVoz);


////////////////////////// Reconocimiento de imagenes //////////////////////////

// extraemos la url de nuestro modelo, lo holdea google y funciona 
const URL = "https://teachablemachine.withgoogle.com/models/OZlbn5-Ct/";

let model, webcam, labelContainer, maxPredictions;
let instrumentoDetectadoCamara = false; // Variable de estado para controlar si se ha detectado un instrumento

// Cargamos el modelo y las imágenes
async function init() {

    // Definimos las URLs del modelo y los metadatos
    const modelURL = URL + "model.json"; // URL del archivo model.json
    const metadataURL = URL + "metadata.json"; // URL del archivo metadata.json

    // Cargamos el modelo y los metadatos
    model = await tmImage.load(modelURL, metadataURL); // Cargamos el modelo y los metadatos desde las URLs definidas
    maxPredictions = model.getTotalClasses(); // Obtenemos el número total de clases del modelo

    // Obtener el array de clases
    const classLabels = model.getClassLabels();

    // Configuramos la cámara web
    const flip = false; // Indica si se debe voltear la cámara web
        webcam = new tmImage.Webcam(300, 300, flip); // Creamos una instancia de la clase Webcam con un tamaño de 200x200 y volteo activado
        await webcam.setup({ facingMode: "environment" }); // Solicitamos acceso a la cámara web y la inicializamos
        await webcam.play(); // Comenzamos a reproducir el flujo de vídeo de la cámara web
        window.requestAnimationFrame(loop); // Iniciamos el bucle de actualización de la cámara web

    // Añadimos elementos al DOM para mostrar la vista previa de la cámara y las etiquetas de clase
    document.getElementById("webcam-container").appendChild(webcam.canvas); // Añadimos el lienzo de la cámara al contenedor correspondiente en el HTML
    labelContainer = document.getElementById("label-container"); // Obtenemos el contenedor de etiquetas
    for (let i = 0; i < maxPredictions; i++) { // Creamos un div por cada etiqueta de clase
        labelContainer.appendChild(document.createElement("div"));
        const botonStart = document.getElementById("boton-camara-1");
        if (botonStart) {
            botonStart.style.display = "none";
      }
    }
    // La camara esta siempre activa y se actualiza en cada frame, no se hace una foto como tal. 
}
// La función loop() se llama inicialmente al iniciar el programa, y luego se llama repetidamente a través de window.requestAnimationFrame(loop).
async function loop() {
    webcam.update(); // haces update de la camara
    prediccion = await predict();
    await check(prediccion);
    window.requestAnimationFrame(loop);
    console.log('checkpoint1')
    }

// Realiza una predicción con el modelo Teachable Machine y almacena las predicciones en una lista y las manda al container
async function predict() {
  const prediction = await model.predict(webcam.canvas);
  console.log(prediction)
  for (let i = 0; i < maxPredictions; i++) {
      const classPrediction =
              prediction[i].className + ": " + prediction[i].probability.toFixed(2);
          labelContainer.childNodes[i].innerHTML = classPrediction; // Para meterlo en el container  
  }
  return prediction;
}

async function check(prediction) {
  // Check if the sound is recognized as a flauta
  console.log(prediction[0].probability)
  if (prediction[0].probability >= 0.75 && !instrumentoDetectadoCamara) {
      socket.emit("CAMARA-RECONOCIDA");
      instrumentoDetectadoCamara = true; // Marcar que se ha detectado un instrumento
      detectarCestaCamara();
      // Detener la cámara y limpiar después de 5 segundos
      setTimeout(() => {
          resetApp(); // Llamada a resetApp para limpiar y detener todo
      }, 5000); // 5000 milisegundos son 5 segundos
  } else {
      // Si no se detecta ningún instrumento después de 5 segundos, detener la cámara y limpiar
      setTimeout(() => {
          if (!instrumentoDetectadoCamara) {
              resetApp();
          }
      }, 8000); // 5000 milisegundos son 5 segundos
  }
}

function resetApp() {
if (webcam) {
webcam.stop(); // Detener la cámara
webcam = null;
document.getElementById("webcam-container").innerHTML = ''; // Limpiar el contenedor de la webcam
labelContainer.innerHTML = ''; // Limpiar el contenedor de las etiquetas
const botonStart = document.getElementById("boton-camara-1");
        if (botonStart) {
            botonStart.style.display = "block"; // Mostrar el botón de inicio
        }
}
instrumentoDetectadoCamara = false;
console.log("Aplicación reseteada al estado inicial.");
}


function detectarCestaCamara(){
  var giroscopioActivo2 = false; // Inicialmente desactivado
  var gyroscope2 = null; // Variable global para el objeto gyroscope

  if (!giroscopioActivo2) {
    console.log('punto 1')
    sumar = 0;
    var umbralGiro = 5;
    var ultimoBeta = 0;
    gyroscope2 = new Gyroscope({ frequency: 60 });
    gyroscope2.addEventListener('reading', function() {
        var beta = gyroscope2.z;
        if (Math.abs(beta - ultimoBeta) > umbralGiro * 1.5) {
            if (beta < umbralGiro) {
                socket.emit("CESTA-SELECCIONADO");
                console.log('punto 2')
            }
        }
        ultimoBeta = beta;
    });
    gyroscope2.start();
    console.log("Detección del giroscopio activada");
  } else {
    gyroscope2.stop();
    console.log("Detección del giroscopio desactivada");
  }
  giroscopioActivo2 = !giroscopioActivo2;
  }

////////////////////// Función Eliminar ///////////////////////////
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


////////////////////// Función Sonido ///////////////////////////

const URL_sonido = "https://teachablemachine.withgoogle.com/models/_CsgfPZ0E/";

async function createModel() {
    const checkpointURL = URL_sonido + "model.json"; // model topology
    const metadataURL = URL_sonido + "metadata.json"; // model metadata

    const recognizer = speechCommands.create(
        "BROWSER_FFT", // fourier transform type, not useful to change
        undefined, // speech commands vocabulary feature, not useful for your models
        checkpointURL,
        metadataURL);

    // check that model and metadata are loaded via HTTPS requests.
    await recognizer.ensureModelLoaded();
    return recognizer;
}

let instrumentoDetectado = false; // Variable de estado para controlar si se ha detectado un instrumento

async function initSonido() {
    // Si ya hay un recognizer en uso, detenemos el reconocimiento
    const recognizer = await createModel();
    const classLabels = recognizer.wordLabels(); // get class labels
    const labelContainer = document.getElementById("label-container-sonido");
    for (let i = 0; i < classLabels.length; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }

    // Función para restablecer la variable instrumentoDetectado a false
    function resetInstrumentoDetectado() {
        instrumentoDetectado = false;
    }

    // listen() takes two arguments:
    // 1. A callback function that is invoked anytime a word is recognized.
    // 2. A configuration object with adjustable fields
    recognizer.listen(result => {
        const scores = result.scores; // probability of prediction for each class
        // render the probability scores per class
        for (let i = 0; i < classLabels.length; i++) {
            const classPrediction = classLabels[i] + ": " + result.scores[i].toFixed(2);
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }

        // Check if the sound is recognized as a flauta
        if (scores[classLabels.indexOf("Flauta")] >= 0.9 && !instrumentoDetectado) {
            socket.emit("AUDIO-RECONOCIDO");
            instrumentoDetectado = true; // Marcar que se ha detectado un instrumento
            detectarFavorito();
        }
    }, {
        includeSpectrogram: true, // in case listen should return result.spectrogram
        probabilityThreshold: 0.75,
        invokeCallbackOnNoiseAndUnknown: true,
        overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
    });

    // Stop the recognition and reset instrumentoDetectado after 5 seconds.
    setTimeout(() => {
        recognizer.stopListening();
        resetInstrumentoDetectado(); // Resetear instrumentoDetectado a false
    }, 8000);
}

function detectarFavorito() {
  // Comprobar si el navegador soporta el sensor de acelerómetro
  console.log("Agita...");
  if (window.DeviceMotionEvent) {
    // Manejar el evento de cambio de aceleración
    var listener = function(event) {
      // Obtener la aceleración en los ejes x, y, z
      var acceleration = event.accelerationIncludingGravity;
      
      // Calcular la aceleración total (módulo del vector de aceleración)
      var accelerationMagnitude = Math.sqrt(
        Math.pow(acceleration.x, 2) +
        Math.pow(acceleration.y, 2) +
        Math.pow(acceleration.z, 2)
      );

      // Definir un umbral de agitación
      var shakeThreshold = 75; 

      // Si la aceleración supera el umbral, emitir el evento "FAVORITO-SELECCIONADO" y detener la detección
      if (accelerationMagnitude > shakeThreshold) {
        console.log("detectado");
        socket.emit("FAVORITO-SELECCIONADO");
        // Detener la detección removiendo el event listener
        window.removeEventListener('devicemotion', listener);
      }
    };
    
    window.addEventListener('devicemotion', listener);
    
  } else {
    console.log('El navegador no soporta el sensor de acelerómetro.');
  }
}

// FUNCIONAMIENTO POPUP DE AYUDA

document.addEventListener('click', function(event) {
  var ayudaPopup = document.getElementById('ayuda-popup');
  var botonAyuda = document.getElementById('ayuda');
  if (!ayudaPopup.contains(event.target) && event.target !== botonAyuda) {
    ayudaPopup.style.display = 'none';
  }
});
// Abrir o cerrar el popup de ayuda al hacer clic en el icono
document.getElementById('ayuda').addEventListener('click', function() {
  var ayudaPopup = document.getElementById('ayuda-popup');
  ayudaPopup.style.display = (ayudaPopup.style.display === 'block') ? 'none' : 'block';
});

const etiquetas = document.querySelectorAll('.etiqueta');
etiquetas.forEach(etiqueta => {
  etiqueta.addEventListener('touchstart', () => {
    const contenido = etiqueta.nextElementSibling;
    // Oculta todos los contenidos excepto el seleccionado
    document.querySelectorAll('.contenido').forEach(elemento => {
      if (elemento !== contenido) {
        elemento.style.display = 'none';
      }
    });
    // Muestra o oculta el contenido seleccionado
    contenido.style.display = contenido.style.display === 'none' ? 'block' : 'none';
  });
});
