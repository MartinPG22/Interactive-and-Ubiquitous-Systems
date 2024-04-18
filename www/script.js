const socket = io(); // Inicializar el socket
let añadido = true;

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

  socket.on("RECARGAR_CARRITO", () => {
    recargarPagina();
  });

  socket.on("FLAUTA-RECONOCIDA", () => {
    popUpFlautaReconocida();
  });

  socket.on("AÑADIR-A-FAV", () => {
    console.log("se añadió ueee");
    if (añadido === true){
      añadirProductoFavoritos();
    }
  });

});

function añadirProductoFavoritos() {
  console.log("ole");
  // Obtener la imagen del div con la clase 'popup'
  const popupImage = document.querySelector('.popup img');
  // Obtener el texto de descripción del popup
  const descripcion = document.querySelector('.descripcion-popup').textContent;
  const precio = document.querySelector('.precio-popup').textContent;

  // Crear un nuevo elemento de instrumento
  const nuevoInstrumento = document.createElement('div');
  nuevoInstrumento.classList.add('instrument');

  // Crear un elemento de imagen para el nuevo instrumento
  const imagen = document.createElement('img');
  imagen.src = popupImage.src;
  imagen.alt = 'Instrumento';

  // Crear un contenedor para la descripción del instrumento
  const instrumentLoc = document.createElement('div');
  instrumentLoc.classList.add('instrument-loc');

  // Crear un encabezado para la descripción del instrumento
  const h3 = document.createElement('h3');
  h3.textContent = descripcion;

  // Crear un párrafo para el precio del instrumento (precio simulado)
  const favprecio = document.createElement('p');
  favprecio.textContent = precio; // Debes reemplazar esto con el precio real

  // Agregar la imagen y la descripción al contenedor del instrumento
  instrumentLoc.appendChild(h3);
  instrumentLoc.appendChild(precio);

  // Agregar la imagen y el contenedor de descripción al nuevo instrumento
  nuevoInstrumento.appendChild(imagen);
  nuevoInstrumento.appendChild(instrumentLoc);

  // Obtener el contenedor de favoritos
  const favoritosContainer = document.querySelector('.favorites');

  // Insertar el nuevo instrumento al contenedor de favoritos
  favoritosContainer.insertBefore(nuevoInstrumento, favoritosContainer.lastElementChild);
}

function popUpFlautaReconocida() {
  // Crear un elemento de div para la ventana emergente
  const popup = document.createElement('div');
  popup.classList.add('popup');

  // Crear un elemento de imagen para la flauta
  const fluteImage = document.createElement('img');
  fluteImage.src = 'images/flauta.png';
  fluteImage.alt = 'Imagen de una flauta';
  fluteImage.style.display = 'block';
  fluteImage.style.margin = 'auto';
  fluteImage.style.width = '250px'; // Establecer el ancho deseado
  fluteImage.style.height = 'auto'; // Esto mantendrá la proporción de la imagen

  // Crear un elemento de párrafo para el nombre del instrumento
  const nameParagraph = document.createElement('p');
  nameParagraph.textContent = 'Te recomendamos la siguiente:';
  nameParagraph.style.fontWeight = 'bold'; // Establecer el peso de la fuente en negrita
  nameParagraph.style.textAlign = 'center'; // Establecer el texto alineado al centro
  nameParagraph.style.fontSize = '25px'; // Establecer el tamaño de fuente más grande

  const fParagraph = document.createElement('p');
  fParagraph.textContent = 'Aulos 509B Symphony Alto Recorder';
  fParagraph.style.fontWeight = 'bold'; // Establecer el peso de la fuente en negrita
  fParagraph.style.textAlign = 'center'; // Establecer el texto alineado al centro
  fParagraph.style.fontSize = '20px'; // Establecer el tamaño de fuente más grande
  fParagraph.classList.add('descripcion-popup'); // Añadir la clase 'descripcion'

  // Crear un elemento de párrafo para el nombre del instrumento
  const recoParagraph = document.createElement('p');
  recoParagraph.textContent = 'SE HA RECONOCIDO UNA FLAUTA';
  recoParagraph.style.fontSize = '30px'; // Establecer el tamaño de fuente más grande
  recoParagraph.style.fontWeight = 'bold'; // Establecer el peso de la fuente en negrita
  recoParagraph.style.textAlign = 'center'; // Establecer el texto alineado al centro

  // Crear un elemento de párrafo para la descripción
  const descriptionParagraph = document.createElement('p');
  descriptionParagraph.textContent = 'Esta flauta es un instrumento musical de viento. Produce sonidos melodiosos y es adecuada para músicos de todos los niveles.';
  descriptionParagraph.style.fontSize = '20px'; // Establecer el tamaño de fuente más grande
  descriptionParagraph.style.textAlign = 'center'; // Establecer el texto alineado al centro

  // Crear un elemento de párrafo para el precio
  const priceParagraph = document.createElement('p');
  priceParagraph.textContent = 'Precio: €45'; // Aquí debes reemplazar con el precio real
  priceParagraph.style.fontSize = '20px'; // Establecer el tamaño de fuente más grande
  priceParagraph.style.fontWeight = 'bold'; // Establecer el peso de la fuente en negrita
  priceParagraph.style.textAlign = 'center'; // Establecer el texto alineado al centro
  fParagraph.classList.add('precio-popup'); // Añadir la clase 'descripcion'

  // Agregar la imagen y el párrafo al div de la ventana emergente
  popup.appendChild(recoParagraph);
  popup.appendChild(nameParagraph);
  popup.appendChild(fParagraph);
  popup.appendChild(fluteImage);
  popup.appendChild(descriptionParagraph);
  popup.appendChild(priceParagraph);

  // Agregar la ventana emergente al cuerpo del documento
  document.body.appendChild(popup);

  // Establecer estilos CSS para la ventana emergente
  popup.style.position = 'fixed';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.background = 'white';
  popup.style.padding = '20px';
  popup.style.border = '2px solid black';
  popup.style.zIndex = '9999';
  popup.style.maxHeight = '80%'; // Establecer la altura máxima

  // Crear la barra de tiempo
  const timeBar = document.createElement('div');
  timeBar.classList.add('time-bar');
  timeBar.style.width = '100%';
  timeBar.style.height = '10px';
  timeBar.style.background = '#C6FF93'; // Color de la barra de tiempo
  timeBar.style.position = 'absolute';
  timeBar.style.bottom = '0';
  timeBar.style.borderRadius = '5px';
  popup.appendChild(timeBar);

  // Cambiar el tamaño de la barra de tiempo gradualmente
  changeSize(timeBar);

  // Desaparecer la ventana emergente cuando se complete la barra de tiempo
  setTimeout(() => {
    añadido = false;
    popup.remove();
  }, 10000); 

  añadido = true;
}

function changeSize(element) {
  let width = 100; // Anchura inicial de la barra de tiempo
  const interval = 50; // Intervalo de tiempo en milisegundos
  const decreaseRate = 0.5; // Tasa de disminución del ancho de la barra de tiempo

  const sizeInterval = setInterval(() => {
    width -= decreaseRate;
    if (width <= 0) {
      clearInterval(sizeInterval);
    }
    element.style.width = `${width}%`;
  }, interval);
}

function recargarPagina() {
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
    // Llamar a la función para eliminar el contenido de la lista de elementos
    eliminarContenidoLista();
  });
}

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

  // Hacer scroll del elemento actual a la vista si está fuera del rango
  instrumentos[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });

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

// Función para eliminar el contenido de la lista de elementos
function eliminarContenidoLista() {
  // Seleccionar el contenedor de la lista de elementos
  const itemList = document.querySelector('.item-list');

  // Verificar si se encontró el contenedor
  if (itemList) {
    // Eliminar todos los elementos hijos del contenedor
    itemList.innerHTML = '';
  } else {
    console.log('No se encontró el contenedor de la lista de elementos.');
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const imagenesPequenas = document.querySelectorAll(".product-image");

  imagenesPequenas.forEach(imagen => {
    imagen.addEventListener("click", function() {
      // Clonar la imagen pequeña
      const imagenEnGrande = this.cloneNode();
      // Establecer el ID para la imagen en grande
      imagenEnGrande.id = "imagenEnGrande";
      // Mostrar la imagen en grande en el contenedor centrado
      mostrarImagenEnGrande(imagenEnGrande);
    });
  });

  // Función para mostrar la imagen en grande centrada en la pantalla
  function mostrarImagenEnGrande(imagenEnGrande) {
    // Crear el contenedor para la imagen en grande
    const imagenEnGrandeContainer = document.createElement("div");
    imagenEnGrandeContainer.id = "imagenEnGrandeContainer";
    // Agregar la imagen en grande al contenedor
    imagenEnGrandeContainer.appendChild(imagenEnGrande);
    // Agregar el contenedor al cuerpo del documento
    document.body.appendChild(imagenEnGrandeContainer);
    // Mostrar el contenedor
    imagenEnGrandeContainer.style.display = "flex";

    // Ocultar la imagen en grande al hacer clic fuera de ella
    imagenEnGrandeContainer.addEventListener("click", function(event) {
      if (event.target === this) {
        this.style.display = "none";
      }
    });
  }
});

  
