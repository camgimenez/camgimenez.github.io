let listaProductos = [];

function agregarListener() {    
    document.querySelector("#btn-entrada-producto").addEventListener('click', e => {
        let input = document.querySelector('#ingreso-producto');
        let producto = input.value;

        if (producto != '' ) {
            listaProductos.push({
                nombre: producto,
                cantidad:1, 
                precio:0
            });
            actualizarLista();


        }
        input.value = '';
    });


    document.querySelector('#btn-borrar-productos').addEventListener('click', e => {
        listaProductos = [];
        actualizarLista();


    document.querySelector('#txt-busqueda').addEventListener('input', e=> {
        let nueva_lista = [];
         listaProductos.forEach(val => {
             if(val.nombre.includes(e.target.value))
                nueva_lista.push(val);
         })
         actualizarLista(nueva_lista);
    })

    });
}


function borrarProd(indice) {
    listaProductos.splice(indice, 1);
    actualizarLista();

}

function cambiarCantidad(indice, input) {
    listaProductos[indice].cantidad = Number(input.value);
}


function cambiarPrecio(indice, input) {
    listaProductos[indice].precio = Number(input.value);
}



function actualizarLista(nueva_lista = false) {
    let ul = document.querySelector('#ul-lista');
    ul.innerHTML = '';

    lista = nueva_lista == false ? listaProductos : nueva_lista;

    lista.forEach(function(producto, indice) {
        ul.innerHTML += `<li class="mdl-list__item">
        <span class="mdl-list__item-primary-content w-10">
            <i class="material-icons">shopping_cart</i>
        </span>
        <span class="mdl-list__item-primary-content w-30">
            ${producto.nombre}
        </span>
        <span class="mdl-list__item-primary-content w-20">

            <div class="mdl-textfield mdl-js-textfield">
                <input class="mdl-textfield__input" type="text" id="sample-cant-${indice}" onchange="cambiarCantidad(${indice, this})">
                <label class="mdl-textfield__label" for="sample-cant-${indice}">${producto.cantidad}</label>
            </div>
            
        </span>
        <span class="mdl-list__item-primary-content w-20 ml-item">

            <div class="mdl-textfield mdl-js-textfield">
                <input class="mdl-textfield__input" type="text" id="sample-precio-${indice}" onchange="cambiarPrecio(${indice, this})">
                <label class="mdl-textfield__label" for="sample-precio-${indice}">${producto.precio}</label>
            </div>

        </span>                        
        <span class="mdl-list__item-primary-content w-20 ml-item">
            <!-- Colored FAB button with ripple -->
            <button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored" onclick="borrarProd(${indice})">
                <i class="material-icons">remove_shopping_cart</i>
            </button>
        </span>

    </li>`
  
    // Es propio de Material Design
    // componentHandler.upgradeElements(document.querySelector('#main'));
     componentHandler.upgradeElements(ul);
    });

}



function inicio() {
    // 1. Agregar los listeners a los botones "entrada-producto" y "borrar producto"
    agregarListener();
   // 2. Actualizar/Dibujar la lista
    actualizarLista();
 }




document.addEventListener('DOMContentLoaded', inicio);
