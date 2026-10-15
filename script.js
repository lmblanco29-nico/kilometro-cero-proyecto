/* =========================================================
   script.js
   -----------------------------------------------------------
   Todo el comportamiento interactivo del sitio vive aquí.
   Está dividido en 4 bloques, en el mismo orden que el
   ejercicio: 1) render de productos, 2) filtro, 3) carrito,
   4) formulario. Al final hay un bloque de "arranque" que
   conecta todo cuando la página termina de cargar.
   ========================================================= */


/* =========================================================
   BLOQUE 0 — Variables de estado
   -----------------------------------------------------------
   "estado" guarda cosas que cambian mientras la persona usa
   la página (qué filtro está activo, qué hay en el carrito).
   "productos" NO se declara aquí: viene de productos.js,
   que se carga antes que este archivo.
   ========================================================= */

const carrito = []; // arreglo de objetos: { id, nombre, precio, cantidad }

// Referencias a elementos del HTML que vamos a usar varias veces.
// Guardarlas en una constante evita buscarlas en el DOM una y otra vez.
const contenedorProductos = document.getElementById("contenedor-productos");
const filtroCategorias = document.getElementById("filtro-categorias");
const listaCarrito = document.getElementById("lista-carrito");
const carritoCantidadEl = document.getElementById("carrito-cantidad");
const carritoTotalEl = document.getElementById("carrito-total");
const carritoVacioMensaje = document.getElementById("carrito-vacio-mensaje");
const botonVaciarCarrito = document.getElementById("boton-vaciar-carrito");
const formularioContacto = document.getElementById("formulario-contacto");
const mensajeConfirmacion = document.getElementById("mensaje-confirmacion");


/* =========================================================
   BLOQUE 1 — Renderizar productos (carga dinámica)
   ========================================================= */

/**
 * Convierte un número (6000) en texto con formato de pesos
 * colombianos ($6.000). Se usa en las tarjetas y en el carrito.
 */
function formatearPrecio(numero) {
  return "$" + numero.toLocaleString("es-CO");
}

/**
 * Recibe un arreglo de productos (puede ser TODOS o solo los
 * filtrados) y construye una tarjeta <article> por cada uno,
 * usando createElement (NO innerHTML con texto concatenado,
 * para evitar errores de etiquetas mal cerradas).
 */
function crearTarjetaProducto(producto) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "tarjeta-producto";

  const imagen = document.createElement("img");
  imagen.src = producto.imagen;
  imagen.alt = producto.nombre;

  const nombre = document.createElement("h3");
  nombre.textContent = producto.nombre;

  const categoria = document.createElement("p");
  categoria.className = "categoria-producto";
  categoria.textContent = producto.categoria;

  const precio = document.createElement("p");
  precio.className = "precio-producto";
  precio.textContent = formatearPrecio(producto.precio);

  const botonAgregar = document.createElement("button");
  botonAgregar.type = "button";
  botonAgregar.className = "btn-agregar";
  botonAgregar.textContent = "Agregar";
  // Guardamos el id del producto en un data-attribute del botón.
  // Así, cuando hagan clic, sabemos CUÁL producto agregar sin
  // tener que crear una función distinta para cada botón.
  botonAgregar.dataset.id = producto.id;

  tarjeta.append(imagen, nombre, categoria, precio, botonAgregar);
  return tarjeta;
}

/**
 * Limpia el contenedor y vuelve a dibujar las tarjetas para la
 * lista de productos que recibe. Se llama tanto al cargar la
 * página (con TODOS los productos) como al filtrar.
 */
function renderizarProductos(listaDeProductos) {
  contenedorProductos.innerHTML = ""; // vaciar lo que había antes

  listaDeProductos.forEach(function (producto) {
    const tarjeta = crearTarjetaProducto(producto);
    contenedorProductos.appendChild(tarjeta);
  });
}


/* =========================================================
   BLOQUE 2 — Filtro por categoría
   ========================================================= */

/**
 * Devuelve solo los productos de una categoría.
 * Si la categoría es "Todos", devuelve el arreglo completo.
 */
function filtrarProductosPorCategoria(categoria) {
  if (categoria === "Todos") {
    return productos;
  }
  return productos.filter(function (producto) {
    return producto.categoria === categoria;
  });
}

/**
 * Se ejecuta cada vez que la persona hace clic en CUALQUIER
 * botón dentro de #filtro-categorias.
 *
 * En vez de poner un addEventListener en cada botón (serían 5
 * listeners), ponemos UNO solo en el contenedor y revisamos
 * en qué elemento exacto se hizo clic. A esto se le llama
 * "delegación de eventos" y es más eficiente.
 */
function manejarClicEnFiltro(evento) {
  const botonPresionado = evento.target;

  // Si el clic no fue sobre un botón de filtro, no hacemos nada.
  if (!botonPresionado.classList.contains("filtro-btn")) {
    return;
  }

  // Quitamos la clase "activo" de todos los botones...
  const todosLosBotones = filtroCategorias.querySelectorAll(".filtro-btn");
  todosLosBotones.forEach(function (boton) {
    boton.classList.remove("activo");
  });

  // ...y se la ponemos solo al que acaban de presionar.
  botonPresionado.classList.add("activo");

  const categoriaElegida = botonPresionado.dataset.categoria;
  const productosFiltrados = filtrarProductosPorCategoria(categoriaElegida);
  renderizarProductos(productosFiltrados);
}


/* =========================================================
   BLOQUE 3 — Carrito de compras
   ========================================================= */

/**
 * Busca si el producto ya está en el carrito.
 * Devuelve el objeto del carrito, o undefined si no está.
 */
function buscarEnCarrito(idProducto) {
  return carrito.find(function (item) {
    return item.id === idProducto;
  });
}

/**
 * Agrega un producto al carrito. Si ya estaba, solo le suma 1
 * a la cantidad en vez de duplicar la fila.
 */
function agregarProductoAlCarrito(idProducto) {
  const productoOriginal = productos.find(function (producto) {
    return producto.id === idProducto;
  });

  if (!productoOriginal) {
    return; // seguridad: si por algún motivo no existe ese id, no hacer nada
  }

  const itemExistente = buscarEnCarrito(idProducto);

  if (itemExistente) {
    itemExistente.cantidad = itemExistente.cantidad + 1;
  } else {
    carrito.push({
      id: productoOriginal.id,
      nombre: productoOriginal.nombre,
      precio: productoOriginal.precio,
      cantidad: 1
    });
  }

  actualizarResumenCarrito();
}

/**
 * Quita por completo un producto del carrito (sin importar
 * la cantidad que tuviera).
 */
function quitarProductoDelCarrito(idProducto) {
  const indice = carrito.findIndex(function (item) {
    return item.id === idProducto;
  });

  if (indice !== -1) {
    carrito.splice(indice, 1);
    actualizarResumenCarrito();
  }
}

/** Vacía el carrito completo. */
function vaciarCarrito() {
  carrito.length = 0; // forma de vaciar un arreglo manteniendo la misma referencia
  actualizarResumenCarrito();
}

/**
 * Vuelve a dibujar la lista del carrito y recalcula los totales.
 * Se llama después de CUALQUIER cambio (agregar, quitar, vaciar).
 */
function actualizarResumenCarrito() {
  listaCarrito.innerHTML = "";

  if (carrito.length === 0) {
    carritoVacioMensaje.classList.remove("oculto");
  } else {
    carritoVacioMensaje.classList.add("oculto");
  }

  let cantidadTotal = 0;
  let precioTotal = 0;

  carrito.forEach(function (item) {
    cantidadTotal = cantidadTotal + item.cantidad;
    precioTotal = precioTotal + item.precio * item.cantidad;

    const fila = document.createElement("li");

    const textoFila = document.createElement("span");
    textoFila.textContent =
      item.nombre + " x" + item.cantidad + " — " + formatearPrecio(item.precio * item.cantidad);

    const botonQuitar = document.createElement("button");
    botonQuitar.type = "button";
    botonQuitar.className = "btn-quitar";
    botonQuitar.textContent = "Quitar";
    botonQuitar.dataset.id = item.id;

    fila.append(textoFila, botonQuitar);
    listaCarrito.appendChild(fila);
  });

  carritoCantidadEl.textContent = cantidadTotal;
  carritoTotalEl.textContent = formatearPrecio(precioTotal);
}

/**
 * Un solo listener para TODOS los botones "Agregar" de las
 * tarjetas (igual que con el filtro: delegación de eventos,
 * porque las tarjetas se crean dinámicamente).
 */
function manejarClicEnContenedorProductos(evento) {
  const elementoClicado = evento.target;

  if (!elementoClicado.classList.contains("btn-agregar")) {
    return;
  }

  const idProducto = Number(elementoClicado.dataset.id);
  agregarProductoAlCarrito(idProducto);
}

/**
 * Un solo listener para todos los botones "Quitar" dentro
 * de la lista del carrito (misma idea de delegación).
 */
function manejarClicEnListaCarrito(evento) {
  const elementoClicado = evento.target;

  if (!elementoClicado.classList.contains("btn-quitar")) {
    return;
  }

  const idProducto = Number(elementoClicado.dataset.id);
  quitarProductoDelCarrito(idProducto);
}


/* =========================================================
   BLOQUE 4 — Formulario de contacto
   ========================================================= */

/**
 * Revisa los campos obligatorios y devuelve una lista de
 * errores (en texto). Si la lista queda vacía, el formulario
 * es válido.
 */
function validarCamposDelFormulario(datos) {
  const errores = [];

  if (datos.nombre.trim() === "") {
    errores.push("El nombre es obligatorio.");
  }

  if (datos.email.trim() === "" || !datos.email.includes("@")) {
    errores.push("Escribe un correo electrónico válido.");
  }

  if (datos.tipoConsulta === "") {
    errores.push("Selecciona un tipo de consulta.");
  }

  if (datos.mensaje.trim() === "") {
    errores.push("Escribe un mensaje.");
  }

  if (!datos.politicaAceptada) {
    errores.push("Debes aceptar la política de privacidad.");
  }

  return errores;
}

/**
 * Muestra el párrafo de confirmación (o de error) quitándole
 * la clase "oculto" y cambiando su texto y color.
 */
function mostrarMensajeFormulario(texto, esError) {
  mensajeConfirmacion.textContent = texto;
  mensajeConfirmacion.classList.remove("oculto");

  if (esError) {
    mensajeConfirmacion.classList.add("error");
  } else {
    mensajeConfirmacion.classList.remove("error");
  }
}

/**
 * Se ejecuta cuando la persona envía el formulario.
 * evento.preventDefault() evita que la página se recargue
 * (que es lo que pasaría por defecto al enviar un <form>).
 */
function manejarEnvioFormulario(evento) {
  evento.preventDefault();

  const datosDelFormulario = {
    nombre: document.getElementById("nombre").value,
    email: document.getElementById("email").value,
    telefono: document.getElementById("telefono").value,
    tipoConsulta: document.getElementById("tipo-consulta").value,
    mensaje: document.getElementById("mensaje").value,
    politicaAceptada: document.getElementById("politica").checked
  };

  const errores = validarCamposDelFormulario(datosDelFormulario);

  if (errores.length > 0) {
    mostrarMensajeFormulario(errores.join(" "), true);
    return; // no seguimos: no hay "envío" si hay errores
  }

  // No hay backend real: "simulamos" el envío imprimiendo
  // los datos en la consola del navegador.
  console.log("Datos del formulario de contacto:", datosDelFormulario);

  mostrarMensajeFormulario(
    "¡Gracias, " + datosDelFormulario.nombre + "! Hemos recibido tu mensaje.",
    false
  );

  formularioContacto.reset();
}


/* =========================================================
   BLOQUE 5 — Arranque de la página
   -----------------------------------------------------------
   Esperamos a que el HTML termine de cargar (DOMContentLoaded)
   antes de tocar el DOM, y aquí conectamos todos los
   addEventListener con sus funciones.
   ========================================================= */

function inicializarAplicacion() {
  renderizarProductos(productos); // pinta todas las tarjetas al cargar

  filtroCategorias.addEventListener("click", manejarClicEnFiltro);
  contenedorProductos.addEventListener("click", manejarClicEnContenedorProductos);
  listaCarrito.addEventListener("click", manejarClicEnListaCarrito);
  botonVaciarCarrito.addEventListener("click", vaciarCarrito);
  formularioContacto.addEventListener("submit", manejarEnvioFormulario);
}

document.addEventListener("DOMContentLoaded", inicializarAplicacion);
