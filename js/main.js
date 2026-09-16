const STORAGE_KEY = 'superListaProductos';

let listaProductos = cargarDatos();

function cargarDatos() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function guardarDatos() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(listaProductos));
    } catch { /* storage full or unavailable */ }
}

function agregarProducto() {
    const input = document.querySelector('#ingreso-producto');
    const nombre = input.value.trim();

    if (!nombre) return;

    listaProductos.push({ nombre, cantidad: 1, precio: 0 });
    guardarDatos();
    actualizarLista();
    input.value = '';
    input.focus();
}

function agregarListener() {
    document.querySelector('#btn-entrada-producto').addEventListener('click', agregarProducto);

    document.querySelector('#ingreso-producto').addEventListener('keydown', e => {
        if (e.key === 'Enter') agregarProducto();
    });

    document.querySelector('#btn-borrar-productos').addEventListener('click', () => {
        if (listaProductos.length === 0) return;
        listaProductos = [];
        guardarDatos();
        actualizarLista();
    });

    document.querySelector('#txt-busqueda').addEventListener('input', e => {
        const termino = e.target.value.toLowerCase();
        if (!termino) {
            actualizarLista();
            return;
        }
        const filtrada = listaProductos.filter(p =>
            p.nombre.toLowerCase().includes(termino)
        );
        actualizarLista(filtrada);
    });

    const btnSearch = document.querySelector('#btn-search');
    const searchContainer = document.querySelector('#search-container');
    const searchInput = document.querySelector('#txt-busqueda');

    btnSearch.addEventListener('click', () => {
        searchContainer.classList.toggle('active');
        if (searchContainer.classList.contains('active')) {
            searchInput.focus();
        } else {
            searchInput.value = '';
            actualizarLista();
        }
    });
}

function borrarProd(indice) {
    listaProductos.splice(indice, 1);
    guardarDatos();
    actualizarLista();
}

function cambiarCantidad(indice, valor) {
    const num = parseInt(valor, 10);
    listaProductos[indice].cantidad = isNaN(num) || num < 1 ? 1 : num;
    guardarDatos();
    actualizarUI();
}

function cambiarPrecio(indice, valor) {
    const num = parseFloat(valor);
    listaProductos[indice].precio = isNaN(num) || num < 0 ? 0 : num;
    guardarDatos();
    actualizarUI();
}

function calcularTotal(lista) {
    return lista.reduce((sum, p) => sum + (p.cantidad * p.precio), 0);
}

function actualizarUI() {
    const total = calcularTotal(listaProductos);
    document.querySelector('#total-valor').textContent = '$' + total.toFixed(2);

    const count = listaProductos.reduce((sum, p) => sum + p.cantidad, 0);
    const tipos = listaProductos.length;
    document.querySelector('#total-items-count').textContent =
        `${tipos} producto${tipos !== 1 ? 's' : ''} · ${count} unidad${count !== 1 ? 'es' : ''}`;

    document.querySelectorAll('.subtotal-cell').forEach(cell => {
        const idx = parseInt(cell.dataset.index, 10);
        const p = listaProductos[idx];
        if (p) cell.textContent = '$' + (p.cantidad * p.precio).toFixed(2);
    });
}

function actualizarLista(listaFiltrada) {
    const ul = document.querySelector('#ul-lista');
    const lista = listaFiltrada || listaProductos;

    ul.innerHTML = '';

    lista.forEach((producto, indice) => {
        const realIndex = listaFiltrada
            ? listaProductos.indexOf(producto)
            : indice;

        const li = document.createElement('li');
        li.className = 'list-item';
        li.innerHTML = `
            <span class="col-icon">
                <i class="material-icons">local_offer</i>
            </span>
            <span class="col-name">${escapeHTML(producto.nombre)}</span>
            <span class="col-qty">
                <input type="number" class="mini-input" value="${producto.cantidad}"
                    min="1" aria-label="Cantidad"
                    onchange="cambiarCantidad(${realIndex}, this.value)">
            </span>
            <span class="col-price">
                <input type="number" class="mini-input" value="${producto.precio}"
                    min="0" step="0.01" aria-label="Precio"
                    onchange="cambiarPrecio(${realIndex}, this.value)">
            </span>
            <span class="col-subtotal subtotal-cell" data-index="${realIndex}">
                $${(producto.cantidad * producto.precio).toFixed(2)}
            </span>
            <span class="col-action">
                <button class="btn-delete" onclick="borrarProd(${realIndex})" aria-label="Eliminar">
                    <i class="material-icons">close</i>
                </button>
            </span>`;
        ul.appendChild(li);
    });

    const hayItems = listaProductos.length > 0;
    const hayResultados = lista.length > 0;

    document.querySelector('#empty-state').classList.toggle('visible', !hayItems);
    document.querySelector('#list-header').classList.toggle('visible', hayResultados);
    document.querySelector('#total-section').classList.toggle('visible', hayItems);
    document.querySelector('#actions-bar').classList.toggle('visible', hayItems);

    actualizarUI();
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function registrarSW() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./serviceWorker.js')
            .then(reg => console.log('SW registrado', reg.scope))
            .catch(err => console.warn('SW error:', err));
    }
}

function inicio() {
    agregarListener();
    actualizarLista();
    registrarSW();
}

document.addEventListener('DOMContentLoaded', inicio);
