
// Este bloque de código comentado es el que se encuentra en index.html en la parte de cliente (creo)

/*<div>Teachable Machine Image Model</div>
<button type="button" onclick="init()">Start</button>
<div id="webcam-container"></div>
<div id="label-container"></div>

//Asi se carga el tensor flow y el techable machine de google 
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js"></script> 
<script src="https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js"></script>
<script src="script.js" >*/

// Mas información sobre la API:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

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


