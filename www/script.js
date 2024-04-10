
// Obtenemos referencias a los elementos que necesitamos manipular
const pantallaPrincipal = document.getElementById("pantalla-principal");
const escaneandoSonido = document.getElementById("escaneando-sonido");
const botonSonido = document.getElementById("boton-sonido");
const botonRetroceder = document.getElementById("boton-retroceder");
const mapa = document.getElementById("map");
const botonMapa = document.getElementById("boton-mapa");

// Ocultamos la sección de escaneando sonido al cargar la página
escaneandoSonido.style.display = "none";
mapa.style.display = "none";

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

// Función para manejar el evento táctil en el botón de mapa
botonMapa.addEventListener("touchstart", function() {
  mapa.style.display = "block";
  pantallaPrincipal.style.display = "none";
  escaneandoSonido.style.display = "none";
});

