/* =========================================================
   productos.js
   -----------------------------------------------------------
   Este archivo SOLO contiene datos: un arreglo de objetos.
   Cada objeto representa un producto del menú, con la misma
   información que ya tenías en las tablas HTML, para que
   script.js pueda "dibujar" las tarjetas dinámicamente.

   Como este archivo se carga ANTES que script.js (ver el
   <script> al final del HTML), la variable "productos" queda
   disponible globalmente para que script.js la use.
   ========================================================= */

const productos = [
  {
    id: 1,
    nombre: "Café",
    categoria: "Bebidas calientes",
    precio: 6000,
    imagen: "bebida-caliente.jpg"
  },
  {
    id: 2,
    nombre: "Aguadepanela",
    categoria: "Bebidas calientes",
    precio: 5000,
    imagen: "bebida-caliente.jpg"
  },
  {
    id: 3,
    nombre: "Chocolate con queso",
    categoria: "Bebidas calientes",
    precio: 6500,
    imagen: "bebida-caliente.jpg"
  },
  {
    id: 4,
    nombre: "Limonada natural",
    categoria: "Bebidas frías",
    precio: 6000,
    imagen: "bebida-fria.jpg"
  },
  {
    id: 5,
    nombre: "Frappé de café",
    categoria: "Bebidas frías",
    precio: 8500,
    imagen: "bebida-fria.jpg"
  },
  {
    id: 6,
    nombre: "Pan de chocolate",
    categoria: "Postres",
    precio: 4500,
    imagen: "postre.jpg"
  },
  {
    id: 7,
    nombre: "Croissant de almendras",
    categoria: "Postres",
    precio: 7000,
    imagen: "postre.jpg"
  },
  {
    id: 8,
    nombre: "Croissant de chocolate",
    categoria: "Postres",
    precio: 6500,
    imagen: "postre.jpg"
  },
  {
    id: 9,
    nombre: "Combo 1 (bebida + panadería)",
    categoria: "Snacks",
    precio: 9000,
    imagen: "snack.jpg"
  },
  {
    id: 10,
    nombre: "Combo 2 (bebida caliente + fría + huevos)",
    categoria: "Snacks",
    precio: 14000,
    imagen: "snack.jpg"
  }
];
