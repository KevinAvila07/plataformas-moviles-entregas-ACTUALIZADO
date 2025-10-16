let contactos = JSON.parse(localStorage.getItem('contactos')) || [
    { nombre: 'Juan', apellido: 'Perez', telefono: '', favorito: false }
];

const listaContactosEl = document.getElementById('lista-contactos');
const formContacto = document.getElementById('form-contacto');
const selectOrden = document.getElementById('select-orden');
const btnFavoritos = document.getElementById('btn-favoritos');
const inputBuscar = document.getElementById('input-buscar');
const btnEliminarMultiples = document.getElementById('btn-eliminar-multiples');

let mostrarSoloFavoritos = false;
let contactosSeleccionados = new Set();

// Guardar contactos en localStorage
function guardarContactos() {
    localStorage.setItem('contactos', JSON.stringify(contactos));
}

// Ordenar contactos según select
function ordenarContactos() {
    const campo = selectOrden.value;
    contactos.sort((a, b) => a[campo].localeCompare(b[campo]));
}

// Filtrar contactos según búsqueda y favoritos
function filtrarContactos() {
    const textoBusqueda = inputBuscar.value.trim().toLowerCase();
    return contactos.filter(c => {
        if (mostrarSoloFavoritos && !c.favorito) return false;
        if (!textoBusqueda) return true;
        return (
            c.nombre.toLowerCase().includes(textoBusqueda) ||
            c.apellido.toLowerCase().includes(textoBusqueda) ||
            c.telefono.toLowerCase().includes(textoBusqueda)
        );
    });
}

// Crear elemento <li> para un contacto
function crearElementoContacto(contacto, index) {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex align-items-center gap-2';
    li.setAttribute('data-index', index);

    // Checkbox selección múltiple
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'form-check-input me-2';
    checkbox.checked = contactosSeleccionados.has(index);
    checkbox.setAttribute('aria-label', 'Seleccionar contacto para eliminar');
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            contactosSeleccionados.add(index);
            li.classList.add('seleccionado');
        } else {
            contactosSeleccionados.delete(index);
            li.classList.remove('seleccionado');
        }
        btnEliminarMultiples.disabled = contactosSeleccionados.size === 0;
    });

    if (checkbox.checked) li.classList.add('seleccionado');

    // Favorito (estrella)
    const star = document.createElement('span');
    star.className = contacto.favorito ? 'favorito' : 'no-favorito';
    star.innerHTML = '★';
    star.title = contacto.favorito ? 'Quitar de favoritos' : 'Marcar como favorito';
    star.style.fontSize = '1.5rem';
    star.style.userSelect = 'none';
    star.setAttribute('role', 'button');
    star.setAttribute('tabindex', '0');
    star.addEventListener('click', () => {
        contacto.favorito = !contacto.favorito;
        guardarContactos();
        mostrarListado();
    });
    star.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            star.click();
        }
    });

    // Campos editables: nombre, apellido, teléfono
    function crearCampoEditable(texto, campo) {
        const span = document.createElement('span');
        span.textContent = texto;
        span.className = 'editable flex-grow-1';
        span.tabIndex = 0;
        span.setAttribute('role', 'textbox');
        span.setAttribute('aria-label', `Editar ${campo}`);

        span.addEventListener('dblclick', () => {
            span.contentEditable = 'true';
            span.focus();
        });

        function guardarEdicion() {
            span.contentEditable = 'false';
            const nuevoTexto = span.textContent.trim();
            if (nuevoTexto.length === 0) {
                // Restaurar valor anterior si vacío
                span.textContent = contacto[campo];
            } else {
                contacto[campo] = nuevoTexto;
                guardarContactos();
                mostrarListado();
            }
        }

        span.addEventListener('blur', guardarEdicion);
        span.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                span.blur();
            }
        });

        return span;
    }

    const nombreSpan = crearCampoEditable(contacto.nombre, 'nombre');
    const apellidoSpan = crearCampoEditable(contacto.apellido, 'apellido');
    const telefonoSpan = crearCampoEditable(contacto.telefono, 'telefono');

    // Botón eliminar
    const btnEliminar = document.createElement('button');
    btnEliminar.className = 'btn btn-sm btn-danger ms-2';
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.setAttribute('aria-label', `Eliminar contacto ${contacto.nombre} ${contacto.apellido}`);
    btnEliminar.addEventListener('click', () => {
        contactos.splice(index, 1);
        contactosSeleccionados.delete(index);
        guardarContactos();
        mostrarListado();
    });

    // Contenedor para los campos
    const camposDiv = document.createElement('div');
    camposDiv.className = 'd-flex gap-3 flex-grow-1 flex-wrap align-items-center';
    camposDiv.appendChild(nombreSpan);
    camposDiv.appendChild(apellidoSpan);
    camposDiv.appendChild(telefonoSpan);

    li.appendChild(checkbox);
    li.appendChild(star);
    li.appendChild(camposDiv);
    li.appendChild(btnEliminar);

    return li;
}

// Mostrar listado en el DOM
function mostrarListado() {
    ordenarContactos();
    const filtrados = filtrarContactos();
    listaContactosEl.innerHTML = '';
    filtrados.forEach((contacto, idx) => {
        // idx es índice en filtrados, necesitamos índice real en contactos
        const indexReal = contactos.indexOf(contacto);
        const li = crearElementoContacto(contacto, indexReal);
        listaContactosEl.appendChild(li);
    });
    btnEliminarMultiples.disabled = contactosSeleccionados.size === 0;
}

// Agregar contacto nuevo
function agregarContacto(nombre, apellido, telefono) {
    if (!nombre.trim() || !apellido.trim()) return;
    contactos.push({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        telefono: telefono.trim(),
        favorito: false
    });
    guardarContactos();
    mostrarListado();
}

// Eliminar múltiples contactos seleccionados
function eliminarMultiples() {
    if (contactosSeleccionados.size === 0) return;
    if (!confirm(`¿Eliminar ${contactosSeleccionados.size} contacto(s) seleccionado(s)?`)) return;

    // Eliminar de mayor a menor índice para no desordenar
    const indices = Array.from(contactosSeleccionados).sort((a,b) => b - a);
    for (const i of indices) {
        contactos.splice(i, 1);
    }
    contactosSeleccionados.clear();
    guardarContactos();
    mostrarListado();
}

// Mostrar solo favoritos toggle
function toggleFavoritos() {
    mostrarSoloFavoritos = !mostrarSoloFavoritos;
    btnFavoritos.setAttribute('aria-pressed', mostrarSoloFavoritos.toString());
    btnFavoritos.textContent = mostrarSoloFavoritos ? 'Mostrar Todos' : 'Mostrar Favoritos';
    mostrarListado();
}

// Buscar contactos
function handlerBuscar() {
    mostrarListado();
}

// Manejador formulario
function handlerFormulario(e) {
    e.preventDefault();
    const nombre = e.target.querySelector('#input-nombre').value;
    const apellido = e.target.querySelector('#input-apellido').value;
    const telefono = e.target.querySelector('#input-telefono').value;

    agregarContacto(nombre, apellido, telefono);

    e.target.reset();
}

// Eventos
formContacto.addEventListener('submit', handlerFormulario);
selectOrden.addEventListener('change', mostrarListado);
btnFavoritos.addEventListener('click', toggleFavoritos);
inputBuscar.addEventListener('input', handlerBuscar);
btnEliminarMultiples.addEventListener('click', eliminarMultiples);

// Inicializar
mostrarListado();