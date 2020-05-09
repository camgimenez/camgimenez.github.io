/* 
Crear el archivo que contiene los eventos del Service Worker

Install  -> se ejecute por PRIMERA Y UNICA VEZ cuando el SW no estuvo presente antes
Activate -> se ejecuta cuando el SW cambia su código
Fetch -> se ejecuta POR CADA PETICION HTTP RECIBIDA a este dominio

*/ 


self.addEventListener('install', e => {
    console.log("Service Worker instalado ", e);

})

self.addEventListener('activate', e => {
    console.log("Service Worker actualizado ", e);
    
})

self.addEventListener('fetch', e => {
    console.log("Registrando peticion", e);
    
})