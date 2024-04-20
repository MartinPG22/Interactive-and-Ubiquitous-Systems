const socket = io(); // Inicializar el socket

socket.on("connect", () => {
  console.log("ready");
  socket.emit("SERVER_READY");

  socket.on("ACK_CONNECTION", () => {
    console.log("ACK");
    compararElementos();
  });

  socket.on("CAMBIAR-INSTRUMENTO-UI", () => {
    cambiarInstrumento(); // Llamar a la función para cambiar el instrumento
  });

  socket.on("ELIMINAR-DIV-UI", () => {
    console.log("recibido");
    eliminarDiv();
  });

  socket.on("RECARGAR_CARRITO", () => {
    recomendacionesFinCompra();
    setTimeout(function() {
      recargarPagina();
    }, 60000); 
  });
  
  socket.on("ABRIR_FAVORITOS", () => {
    abrirFavoritos();
  });
  socket.on("ABRIR_CESTA", () => {
    abrirCesta();
  });

  socket.on("FLAUTA-RECONOCIDA", () => {
    popUpInstrumentoReconocidoFav("flauta");
  });

  socket.on("FLAUTA-RECONOCIDA-CAMARA", () => {
    console.log("flauta negra")
    popUpInstrumentoReconocidoCesta("flauta negra");
  });

  socket.on("TAMBOR-RECONOCIDO-CAMARA", () => {
    // Aqui no llega 
    console.log("tambor")
    popUpInstrumentoReconocidoCesta("tambor");
  });

  socket.on("AÑADIR-A-FAV", () => {
    console.log("se añadió ueee");
    añadirProductoFavoritos();
  });

  socket.on("AÑADIR-A-CESTA", () => {
    console.log("se añadió a cesta");
    añadirProductoCesta();
  });
  
  socket.on("NO-AÑADIR-A-CESTA", () => {
    console.log("que no se añada");
    let popupElement = document.querySelector('.popup');
    popupElement.remove();
  });

  socket.on("CAMBIAR-ORDEN-MENOR-MAYOR", () => {
    cambiarOrdenMenosMas();
  });

  socket.on("CAMBIAR-ORDEN-MAYOR-MENOR", () => {
    cambiarOrdenMasMenos();
  });

});


function recomendacionesFinCompra() {
  fetch('data/recomendaciones.json')
    .then(response => response.json())
    .then(data => {
      const instrumentosComprados = Array.from(document.querySelectorAll('.product-name')).map(item => item.textContent.trim());
      const recomendacionesFiltradas = filtrarRecomendaciones(data.instrumentos, instrumentosComprados);
      mostrarPopupRecomendaciones(recomendacionesFiltradas);

      // Establecer temporizador para cerrar automáticamente el popup después de 60 segundos
      setTimeout(() => {
        // Cerrar el popup automáticamente
        let popupDiv = document.getElementById('miPopup');
        if (popupDiv) {
          document.body.removeChild(popupDiv);
        }
      }, 60000); // 60 segundos
    })
    .catch(error => {
      console.error('Error al obtener el archivo JSON:', error);
    });
}
function filtrarRecomendaciones(recomendaciones, instrumentosComprados) {
  const recomendacionesFiltradas = recomendaciones.filter(instrumento => instrumentosComprados.includes(instrumento.nombre));
  return recomendacionesFiltradas;
}

function mostrarPopupRecomendaciones(instrumentos) {
  // Crear el elemento del popup
  var popupDiv = document.createElement('div');
  popupDiv.id = 'miPopup'; // Asignar un ID al popup
  document.body.appendChild(popupDiv);

  // Aplicar estilos al popup
  popupDiv.style.position = 'fixed';
  popupDiv.style.top = '50%';
  popupDiv.style.left = '50%';
  popupDiv.style.transform = 'translate(-50%, -50%)';
  popupDiv.style.backgroundColor = '#ffffff';
  popupDiv.style.padding = '20px';
  popupDiv.style.border = '2px solid #333333';
  popupDiv.style.zIndex = '9999';
  popupDiv.style.maxWidth = '800px'; // Ancho máximo del popup

  // Crear el contenido del popup
  var contenidoPopup = document.createElement('div');
  contenidoPopup.innerHTML = '<h2 style="text-align: center; font-size: 35px; color:red;">MIENTRAS SU COMPRA SE PROCESA, ¡DISFRUTE ESTAS CANCIONES RECOMENDADAS PARA LOS INSTRUMENTOS QUE HA COMPRADO!:</h2>';

  // Iterar sobre cada instrumento
  instrumentos.forEach(instrumento => {
    var instrumentoDiv = document.createElement('div');
    var nombreInstrumento = document.createElement('h3');
    nombreInstrumento.textContent = instrumento.nombre;
    nombreInstrumento.style.textAlign = 'center'; // Centrar el texto
    nombreInstrumento.style.fontSize = '22px'; // Tamaño de fuente más grande para el nombre del instrumento
    instrumentoDiv.appendChild(nombreInstrumento);


    if (instrumento.canciones_recomendadas && instrumento.canciones_recomendadas.length > 0) {
      var enlacesDiv = document.createElement('div'); // Contenedor para los enlaces
      instrumento.canciones_recomendadas.forEach(cancion => {
        var enlace = document.createElement('a');
        enlace.href = cancion.url;
        enlace.target = '_blank';
        enlace.textContent = cancion.nombre;
        enlace.style.display = 'block'; // Mostrar cada enlace en una línea nueva
        enlace.style.textAlign = 'center'; // Centrar el texto
        enlace.style.fontSize = '20px'; // Tamaño de fuente más grande
        enlacesDiv.appendChild(enlace);
      });
      instrumentoDiv.appendChild(enlacesDiv);
    } else {
      var p = document.createElement('p');
      p.textContent = 'No hay canciones recomendadas.';
      instrumentoDiv.appendChild(p);
    }

    contenidoPopup.appendChild(instrumentoDiv);
  });

  // Añadir el contenido al popup
  popupDiv.appendChild(contenidoPopup);

  // Botón para cerrar el pop-up
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Cerrar';
  closeButton.style.display = 'block';
  closeButton.style.marginTop = '10px';
  closeButton.style.marginLeft = 'auto'; 
  closeButton.style.marginRight = 'auto'; 
  closeButton.addEventListener('click', () => {
      document.body.removeChild(popupDiv);
  });

  popupDiv.appendChild(closeButton);

  // Botón para compartir
  const compartirButton = document.createElement('button');
  compartirButton.textContent = 'Compartir Recomendaciones';
  compartirButton.style.display = 'block';
  compartirButton.style.marginTop = '10px';
  compartirButton.style.marginLeft = 'auto'; // Centrar horizontalmente
  compartirButton.style.marginRight = 'auto'; // Centrar horizontalment
  compartirButton.addEventListener('click', () => {
      compartirRecomendaciones(instrumentos);
  });

  popupDiv.appendChild(compartirButton);
}

function compartirRecomendaciones(instrumentos) {
  if (navigator.share) {
    let textoFinal = 'Echa un vistazo a estas canciones recomendadas para instrumentos musicales:\n\n';

    instrumentos.forEach(instrumento => {
      if (instrumento.canciones_recomendadas && instrumento.canciones_recomendadas.length > 0) {
        textoFinal += `Para ${instrumento.nombre}:\n`;
        instrumento.canciones_recomendadas.forEach(cancion => {
          textoFinal += `- ${cancion.nombre}\n`;
        });
        textoFinal += '\n';
      }
    });

    navigator.share({
      title: 'Recomendaciones de Canciones',
      text: textoFinal,
    }).then(() => {
      console.log('Contenido compartido con éxito');
    }).catch((error) => {
      console.error('Error al compartir:', error);
    });
  } else {
    alert('Lo siento, la funcionalidad de compartir no está disponible en este navegador.');
  }
}




function cambiarOrdenMenosMas() {
  // Obtener todos los elementos de producto
  const productos = Array.from(document.querySelectorAll(".item"));

  // Ordenar los productos por precio de menor a mayor
  productos.sort(function(a, b) {
      const precioA = parseFloat(a.querySelector(".product-price").textContent.trim().replace("€", ""));
      const precioB = parseFloat(b.querySelector(".product-price").textContent.trim().replace("€", ""));
      return precioA - precioB;
  });

  // Vaciar el contenedor de productos
  const contenedorProductos = document.querySelector(".item-list");
  contenedorProductos.innerHTML = "";

  // Agregar los productos ordenados al contenedor
  productos.forEach(function(producto) {
      contenedorProductos.appendChild(producto);
  });
}

function cambiarOrdenMasMenos() {
  // Obtener todos los elementos de producto
  const productos = Array.from(document.querySelectorAll(".item"));

  // Ordenar los productos por precio de mayor a menor
  productos.sort(function(a, b) {
      const precioA = parseFloat(a.querySelector(".product-price").textContent.trim().replace("€", ""));
      const precioB = parseFloat(b.querySelector(".product-price").textContent.trim().replace("€", ""));
      return precioB - precioA;
  });

  // Vaciar el contenedor de productos
  const contenedorProductos = document.querySelector(".item-list");
  contenedorProductos.innerHTML = "";

  // Agregar los productos ordenados al contenedor
  productos.forEach(function(producto) {
      contenedorProductos.appendChild(producto);
  });
}

function abrirFavoritos() {
  var cart = document.querySelector('.cart');
  var favorites = document.querySelector('.favorites');

  // Si los favoritos están ocultos, los mostramos
  if (favorites.classList.contains('invisible')) {
    favorites.classList.remove('invisible');
  }

  // Si la cesta está visible, la ocultamos
  if (!cart.classList.contains('invisible')) {
    cart.classList.add('invisible');
  }
}

function abrirCesta() {
  var cart = document.querySelector('.cart');
  var favorites = document.querySelector('.favorites');

  // Si la cesta está oculta, la mostramos
  if (cart.classList.contains('invisible')) {
    cart.classList.remove('invisible');
  }

  // Si los favoritos están visibles, los ocultamos
  if (!favorites.classList.contains('invisible')) {
    favorites.classList.add('invisible');
  }
}

function añadirProductoFavoritos() {
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
  const precioParagraph = document.createElement('p');
  precioParagraph.textContent = precio; // Debes reemplazar esto con el precio real

  // Agregar la imagen y la descripción al contenedor del instrumento
  instrumentLoc.appendChild(h3);
  instrumentLoc.appendChild(precioParagraph);

  // Agregar la imagen y el contenedor de descripción al nuevo instrumento
  nuevoInstrumento.appendChild(imagen);
  nuevoInstrumento.appendChild(instrumentLoc);

  // Obtener el contenedor de favoritos
  const favoritosContainer = document.querySelector('.favorites');

  // Verificar si ya existe un elemento similar en el contenedor de favoritos
  const elementosFavoritos = favoritosContainer.querySelectorAll('.instrument');
  let elementoExistente = false;
  elementosFavoritos.forEach(elemento => {
    const descripcionExistente = elemento.querySelector('h3').textContent;
    const precioExistente = elemento.querySelector('p').textContent;
    if (descripcionExistente === descripcion && precioExistente === precio) {
      elementoExistente = true;
    }
  });

  // Si no existe un elemento similar, añadirlo al contenedor de favoritos
  if (!elementoExistente) {
    favoritosContainer.insertBefore(nuevoInstrumento, favoritosContainer.lastElementChild);
  }

  compararElementos();
}

function añadirProductoCesta() {
  console.log("ole cesta ");
  // Obtener la imagen del div con la clase 'popup'
  const popupImage = document.querySelector('.popup img').src;

  // Obtenemos la lista donde metemos el item 
  var itemList = document.querySelector('.item-list');

  // Obtener el texto de descripción del popup
  const descripcion = document.querySelector('.descripcion-popup').textContent;
  const precio = document.querySelector('.precio-popup').textContent;
  const precioNumerico = parseFloat(precio.match(/\d+(\.\d+)?/)[0]);
  // Crear un nuevo elemento de artículo
  var nuevoItem = document.createElement('div');
  nuevoItem.classList.add('item');

  // Crear la estructura interna del nuevo elemento de artículo
  nuevoItem.innerHTML = `
  <div class="imagen-pequena-container">
      <img src="${popupImage}" alt="flauta" class="product-image">
  </div>
  <div class="product-details">
      <h3 class="product-name">${descripcion}</h3>
      <div class="contenedor-fav">
          <p class="product-price">€${precioNumerico.toFixed(2)}</p>
          <img class="favorito-marcado" src="images/favs.png" alt="icono fav">
      </div>
  </div>`;

  // Agregar el nuevo elemento de artículo al contenedor de la lista de artículos
  itemList.appendChild(nuevoItem);

  compararElementos();
}


async function popUpInstrumentoReconocidoFav(instrumento) {
  // Cargar el JSON desde una URL o archivo local
  console.log("popup");
  const response = await fetch('data/instrumentos.json');
  const data = await response.json();
  console.log(data);

  // Obtener los datos específicos del instrumento del JSON
  const instrumentData = data[instrumento];

  // Crear un elemento de div para la ventana emergente
  const popup = document.createElement('div');
  popup.classList.add('popup');

  // Crear los elementos HTML a partir de los datos del JSON para el instrumento específico
  const image = document.createElement('img');
  image.src = instrumentData.image.src;
  image.alt = instrumentData.image.alt;

  // Aplicar estilos de tamaño de la imagen
  const imageStyle = instrumentData.image.style;
  if (imageStyle) {
    Object.keys(imageStyle).forEach(property => {
      image.style[property] = imageStyle[property];
    });
  }
  
  const nameParagraph = document.createElement('p');
  nameParagraph.textContent = instrumentData.nameParagraph.text;
  Object.assign(nameParagraph.style, instrumentData.nameParagraph.style);

  const Paragraph = document.createElement('p');
  Paragraph.textContent = instrumentData.Paragraph.text;
  Object.assign(Paragraph.style, instrumentData.Paragraph.style);
  Paragraph.classList.add(instrumentData.Paragraph.class);

  const recoParagraph = document.createElement('p');
  recoParagraph.textContent = instrumentData.recoParagraph.text;
  Object.assign(recoParagraph.style, instrumentData.recoParagraph.style);

  const descriptionParagraph = document.createElement('p');
  descriptionParagraph.textContent = instrumentData.descriptionParagraph.text;
  Object.assign(descriptionParagraph.style, instrumentData.descriptionParagraph.style);

  const priceParagraph = document.createElement('p');
  priceParagraph.textContent = instrumentData.priceParagraph.text;
  Object.assign(priceParagraph.style, instrumentData.priceParagraph.style);
  priceParagraph.classList.add(instrumentData.priceParagraph.class);

  // Agregar los elementos creados al div de la ventana emergente
  popup.appendChild(nameParagraph);
  popup.appendChild(image);
  popup.appendChild(Paragraph);
  popup.appendChild(recoParagraph);
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
  const timer = changeSize(timeBar);

  // Desaparecer la ventana emergente cuando se complete el tiempo
  setTimeout(() => {
    clearInterval(timer);
    popup.remove();
  }, 10000); // 10000 milisegundos = 10 segundos

  // Desaparecer la ventana emergente después de un breve retraso cuando se recibe el evento "AÑADIR-A-FAV"
  socket.on("AÑADIR-A-FAV", () => {
    console.log("se añadió ueee");
    setTimeout(() => {
      clearInterval(timer);
      popup.remove();
    }, 2000); // 2000 milisegundos = 2 segundos de retraso
  });
}

async function popUpInstrumentoReconocidoCesta(instrumento) {
  const response = await fetch('data/instrumentos_cesta.json');
  const data = await response.json();
  console.log(data);

  // Obtener los datos específicos del instrumento del JSON
  const instrumentData = data[instrumento];

  // Crear un elemento de div para la ventana emergente
  const popup = document.createElement('div');
  popup.classList.add('popup');

  // Crear los elementos HTML a partir de los datos del JSON para el instrumento específico
  const image = document.createElement('img');
  image.src = instrumentData.image.src;
  image.alt = instrumentData.image.alt;

  // Aplicar estilos de tamaño de la imagen
  const imageStyle = instrumentData.image.style;
  if (imageStyle) {
    Object.keys(imageStyle).forEach(property => {
      image.style[property] = imageStyle[property];
    });
  }
  
  const nameParagraph = document.createElement('p');
  nameParagraph.textContent = instrumentData.nameParagraph.text;
  Object.assign(nameParagraph.style, instrumentData.nameParagraph.style);

  const Paragraph = document.createElement('p');
  Paragraph.textContent = instrumentData.Paragraph.text;
  Object.assign(Paragraph.style, instrumentData.Paragraph.style);
  Paragraph.classList.add(instrumentData.Paragraph.class);

  const recoParagraph = document.createElement('p');
  recoParagraph.textContent = instrumentData.recoParagraph.text;
  Object.assign(recoParagraph.style, instrumentData.recoParagraph.style);

  const descriptionParagraph = document.createElement('p');
  descriptionParagraph.textContent = instrumentData.descriptionParagraph.text;
  Object.assign(descriptionParagraph.style, instrumentData.descriptionParagraph.style);

  const priceParagraph = document.createElement('p');
  priceParagraph.textContent = instrumentData.priceParagraph.text;
  Object.assign(priceParagraph.style, instrumentData.priceParagraph.style);
  priceParagraph.classList.add(instrumentData.priceParagraph.class);

  // Agregar los elementos creados al div de la ventana emergente
  popup.appendChild(nameParagraph);
  popup.appendChild(image);
  popup.appendChild(Paragraph);
  popup.appendChild(recoParagraph);
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

  // Desaparecer la ventana emergente después de un breve retraso cuando se recibe el evento "AÑADIR-A-CESTA"
  socket.on("AÑADIR-A-CESTA", () => {
    console.log("se quita ventana");
    setTimeout(() => {
      popup.remove();
    }, 2000); // 2000 milisegundos = 2 segundos de retraso
  });
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



// Índice para rastrear el elemento actual
var currentIndex = 0;

// Elemento anterior
var elementoAnterior = null;

// Función para cambiar el fondo del elemento actual y actualizar el índice
function cambiarInstrumento() {
  let elementos = null;

  // Obtener la lista de elementos dependiendo de la ubicación
  const cart = document.querySelector('.cart');
  const favorites = document.querySelector('.favorites');

  if (cart && !cart.classList.contains('invisible')) {
    elementos = document.querySelectorAll('.cart .item');
  } else if (favorites && !favorites.classList.contains('invisible')) {
    elementos = document.querySelectorAll('.favorites .instrument');
  } else {
    console.log('No se encontró el contenedor de la lista de elementos.');
    return;
  }

  // Restaurar el fondo del elemento anterior si existe
  if (elementoAnterior) {
    elementoAnterior.style.backgroundColor = ""; // Restaurar el color de fondo original
  }

  // Cambiar el fondo del elemento actual
  elementos[currentIndex].style.backgroundColor = "#b0b0b0";

  // Hacer scroll del elemento actual a la vista si está fuera del rango
  elementos[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Guardar una referencia al elemento actual como elemento anterior
  elementoAnterior = elementos[currentIndex];

  // Actualizar el índice al siguiente elemento
  currentIndex = (currentIndex + 1) % elementos.length;
}

function eliminarDiv() {
  let elementos = null;

  // Obtener la lista de elementos dependiendo de la ubicación
  const cart = document.querySelector('.cart');
  const favorites = document.querySelector('.favorites');

  if (cart && !cart.classList.contains('invisible')) {
    elementos = document.querySelectorAll('.cart .item');
  } else if (favorites && !favorites.classList.contains('invisible')) {
    elementos = document.querySelectorAll('.favorites .instrument');
  } else {
    console.log('No se encontró el contenedor de la lista de elementos.');
    return;
  }

  // Recorrer todos los elementos
  elementos.forEach(elemento => {
    // Obtener el color de fondo del elemento
    var colorDeFondo = window.getComputedStyle(elemento).getPropertyValue("background-color");

    // Comprobar si el color de fondo es igual al deseado (por ejemplo, rgb(176, 176, 176))
    if (colorDeFondo === "rgb(176, 176, 176)") {
      // Eliminar el color de fondo
      elemento.style.backgroundColor = "transparent";
      
      // Eliminar el elemento
      elemento.remove();

    }
  });

  compararElementos();
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

function compararElementos() {
  const itemsLista = document.querySelectorAll('.item-list .item');
  const itemsFavoritos = document.querySelectorAll('.favorites .instrument');

  itemsLista.forEach(itemLista => {
    const nombreLista = itemLista.querySelector('.product-name').textContent.trim();
    let encontradaCoincidencia = false; // Variable para indicar si se encontró una coincidencia

    itemsFavoritos.forEach(itemFavorito => {
      const nombreFavorito = itemFavorito.querySelector('h3').textContent.trim();
      if (nombreLista === nombreFavorito) {
        const favoritoMarcado = itemLista.querySelector('.favorito-marcado');
        favoritoMarcado.style.display = 'block';
        encontradaCoincidencia = true; // Se ha encontrado una coincidencia
      }
    });

    // Si no se encontró ninguna coincidencia, ocultar el elemento .favorito-marcado
    if (!encontradaCoincidencia) {
      const favoritoMarcado = itemLista.querySelector('.favorito-marcado');
      favoritoMarcado.style.display = 'none';
    }
  });
}
