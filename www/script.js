const socket = io(); // Inicializar el socket

socket.on("connect", () => {
  console.log("ready");
  socket.emit("SERVER_READY");

  socket.on("ACK_CONNECTION", () => {
    console.log("ACK");
  });

  socket.on("CAMBIAR-INSTRUMENTO-UI", () => {
    cambiarInstrumento(); // Llamar a la función para cambiar el instrumento
  });

  socket.on("ELIMINAR-DIV-UI", () => {
    console.log("recibido");
    eliminarDiv();
  });

});

document.addEventListener("DOMContentLoaded", function() {
  const cartButton = document.getElementById("cartButton");
  const favButton = document.getElementById("favButton");

  const cartContent = document.querySelector(".cart");
  const favContent = document.querySelector(".favorites");

  const totalPriceElement = document.getElementById("totalPrice");

  const qrcode = new QRCode("qrcode", {
    text: "http://localhost:3000/cliente/index.html",
    width: 90,
    height: 90,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  // Función para recalcular el precio total
  function calculateTotalPrice() {
    let total = 0;
    const productPrices = document.querySelectorAll(".product-price");
    productPrices.forEach(priceElement => {
      const price = parseFloat(priceElement.textContent.replace("€", ""));
      total += price;
    });
    return total.toFixed(2); // Redondeamos el total a dos decimales
  }

  // Actualizar el precio total al cargar la página
  totalPriceElement.textContent = calculateTotalPrice();

  // Ocultar los favoritos por defecto
  cartContent.classList.remove("invisible");

  cartButton.addEventListener("click", function() {
    favContent.classList.add("invisible");
    cartContent.classList.remove("invisible");
    totalPriceElement.textContent = calculateTotalPrice(); // Actualizar el precio total al abrir la cesta
  });

  favButton.addEventListener("click", function() {
    cartContent.classList.add("invisible");
    favContent.classList.remove("invisible");
    totalPriceElement.textContent = calculateTotalPrice(); // Actualizar el precio total al abrir los favoritos
  });

  // Añadir un evento para recalcular el precio total cuando se modifique la cesta
  const observer = new MutationObserver(() => {
    totalPriceElement.textContent = calculateTotalPrice();
  });
  observer.observe(cartContent, { childList: true, subtree: true });
  
  setTimeout(function() {
    document.querySelector(".loader").style.display = "none";
    document.getElementById("mainContent").classList.remove("hidden");
    document.body.classList.remove("loading");
  }, 1000);
});

/* Recibir la señal de compra y recargar la página
const socket = io(); // Inicializar el socket
socket.on("COMPRA_PROCESADA", () => {
  console.log("Se recibió la señal de compra. Recargando la página...");
  location.reload(); // Recargar la página
});*/

// Lista de elementos de instrumentos
var instrumentos = document.querySelectorAll('.item');

// Índice para rastrear el elemento actual
var currentIndex = 0;

// Elemento anterior
var elementoAnterior = null;

// Función para cambiar el fondo del elemento actual y actualizar el índice
function cambiarInstrumento() {
  // Restaurar el fondo del elemento anterior si existe
  if (elementoAnterior) {
    elementoAnterior.style.backgroundColor = ""; // Restaurar el color de fondo original
  }

  // Cambiar el fondo del elemento actual a negro
  instrumentos[currentIndex].style.backgroundColor = "#b0b0b0";

  // Guardar una referencia al elemento actual como elemento anterior
  elementoAnterior = instrumentos[currentIndex];

  // Actualizar el índice al siguiente elemento
  currentIndex = (currentIndex + 1) % instrumentos.length;
}

function eliminarDiv() {
  // Recorrer todos los elementos
  for (var i = 0; i < instrumentos.length; i++) {
      var instrumento = instrumentos[i];
      
      // Obtener el color de fondo del elemento
      var colorDeFondo = window.getComputedStyle(instrumento).getPropertyValue("background-color");

      // Comprobar si el color de fondo es igual al deseado (por ejemplo, rgb(176, 176, 176))
      if (colorDeFondo === "rgb(176, 176, 176)") {
          // Eliminar el color de fondo
          instrumento.style.backgroundColor = "transparent";
          
          // Eliminar el elemento
          instrumento.remove();
          
          // Obtener el hr que está justo antes del instrumento
          var hrSeparador = instrumento.previousElementSibling;

          // Verificar si el elemento anterior es un hr y tiene la clase 'item-separador'
          if (hrSeparador && hrSeparador.classList.contains('item-separator')) {
              // Eliminar el hr
              hrSeparador.remove();
          }
      }
  }
}
