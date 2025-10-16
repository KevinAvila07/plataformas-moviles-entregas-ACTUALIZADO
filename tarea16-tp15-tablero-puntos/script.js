const puntosLocalEl = document.getElementById('puntos-local');
const puntosVisitanteEl = document.getElementById('puntos-visitante');

const nombreLocalEl = document.getElementById('nombre-local');
const nombreVisitanteEl = document.getElementById('nombre-visitante');

const btnLocalMas = document.getElementById('btn-local-mas');
const btnLocalMenos = document.getElementById('btn-local-menos');
const btnVisitanteMas = document.getElementById('btn-visitante-mas');
const btnVisitanteMenos = document.getElementById('btn-visitante-menos');

const btnInvertir = document.getElementById('btn-invertir');
const btnFinalizar = document.getElementById('btn-finalizar');
const btnReiniciar = document.getElementById('btn-reiniciar');

const colorFondoInput = document.getElementById('color-fondo');
const colorLocalInput = document.getElementById('color-local');
const colorVisitanteInput = document.getElementById('color-visitante');

let puntosLocal = 0;
let puntosVisitante = 0;
let partidoFinalizado = false;

// Actualiza la visualización de puntos
function actualizarPuntos() {
    puntosLocalEl.textContent = puntosLocal;
    puntosVisitanteEl.textContent = puntosVisitante;
}

// Habilita o deshabilita botones según estado partido
function actualizarEstadoBotones() {
    const botones = [
        btnLocalMas, btnLocalMenos,
        btnVisitanteMas, btnVisitanteMenos,
        btnInvertir
    ];
    botones.forEach(btn => btn.disabled = partidoFinalizado);
    btnFinalizar.setAttribute('aria-pressed', partidoFinalizado.toString());
    btnFinalizar.textContent = partidoFinalizado ? 'Partido Finalizado' : 'Finalizar Partido';
}

// Cambiar color de fondo y equipos
function aplicarColores() {
    document.body.style.backgroundColor = colorFondoInput.value;
    puntosLocalEl.style.color = colorLocalInput.value;
    nombreLocalEl.style.color = colorLocalInput.value;
    puntosVisitanteEl.style.color = colorVisitanteInput.value;
    nombreVisitanteEl.style.color = colorVisitanteInput.value;
}

// Incrementar puntos local
btnLocalMas.addEventListener('click', () => {
    if (partidoFinalizado) return;
    puntosLocal++;
    actualizarPuntos();
});

// Decrementar puntos local
btnLocalMenos.addEventListener('click', () => {
    if (partidoFinalizado) return;
    if (puntosLocal > 0) puntosLocal--;
    actualizarPuntos();
});

// Incrementar puntos visitante
btnVisitanteMas.addEventListener('click', () => {
    if (partidoFinalizado) return;
    puntosVisitante++;
    actualizarPuntos();
});

// Decrementar puntos visitante
btnVisitanteMenos.addEventListener('click', () => {
    if (partidoFinalizado) return;
    if (puntosVisitante > 0) puntosVisitante--;
    actualizarPuntos();
});

// Invertir puntajes
btnInvertir.addEventListener('click', () => {
    if (partidoFinalizado) return;
    [puntosLocal, puntosVisitante] = [puntosVisitante, puntosLocal];
    actualizarPuntos();
});

// Finalizar partido
btnFinalizar.addEventListener('click', () => {
    partidoFinalizado = !partidoFinalizado;
    actualizarEstadoBotones();
});

// Reiniciar tablero
btnReiniciar.addEventListener('click', () => {
    puntosLocal = 0;
    puntosVisitante = 0;
    partidoFinalizado = false;
    actualizarPuntos();
    actualizarEstadoBotones();
});

// Cambiar colores
colorFondoInput.addEventListener('input', aplicarColores);
colorLocalInput.addEventListener('input', aplicarColores);
colorVisitanteInput.addEventListener('input', aplicarColores);

// Guardar nombres en localStorage para persistencia
function guardarNombres() {
    localStorage.setItem('nombreLocal', nombreLocalEl.textContent.trim());
    localStorage.setItem('nombreVisitante', nombreVisitanteEl.textContent.trim());
}

function cargarNombres() {
    const nLocal = localStorage.getItem('nombreLocal');
    const nVisitante = localStorage.getItem('nombreVisitante');
    if (nLocal) nombreLocalEl.textContent = nLocal;
    if (nVisitante) nombreVisitanteEl.textContent = nVisitante;
}

// Guardar colores en localStorage
function guardarColores() {
    localStorage.setItem('colorFondo', colorFondoInput.value);
    localStorage.setItem('colorLocal', colorLocalInput.value);
    localStorage.setItem('colorVisitante', colorVisitanteInput.value);
}

function cargarColores() {
    const cFondo = localStorage.getItem('colorFondo');
    const cLocal = localStorage.getItem('colorLocal');
    const cVisitante = localStorage.getItem('colorVisitante');
    if (cFondo) colorFondoInput.value = cFondo;
    if (cLocal) colorLocalInput.value = cLocal;
    if (cVisitante) colorVisitanteInput.value = cVisitante;
    aplicarColores();
}

// Guardar puntos en localStorage
function guardarPuntos() {
    localStorage.setItem('puntosLocal', puntosLocal);
    localStorage.setItem('puntosVisitante', puntosVisitante);
    localStorage.setItem('partidoFinalizado', partidoFinalizado);
}

// Cargar puntos desde localStorage
function cargarPuntos() {
    const pLocal = localStorage.getItem('puntosLocal');
    const pVisitante = localStorage.getItem('puntosVisitante');
    const finalizado = localStorage.getItem('partidoFinalizado');
    puntosLocal = pLocal !== null ? parseInt(pLocal, 10) : 0;
    puntosVisitante = pVisitante !== null ? parseInt(pVisitante, 10) : 0;
    partidoFinalizado = finalizado === 'true';
    actualizarPuntos();
    actualizarEstadoBotones();
}

// Guardar todo en localStorage
function guardarTodo() {
    guardarNombres();
    guardarColores();
    guardarPuntos();
}

// Eventos para guardar nombres al editar (on blur)
nombreLocalEl.addEventListener('blur', () => {
    if (nombreLocalEl.textContent.trim() === '') nombreLocalEl.textContent = 'Local';
    guardarNombres();
});
nombreVisitanteEl.addEventListener('blur', () => {
    if (nombreVisitanteEl.textContent.trim() === '') nombreVisitanteEl.textContent = 'Visitante';
    guardarNombres();
});

// Guardar colores al cambiar
colorFondoInput.addEventListener('change', guardarColores);
colorLocalInput.addEventListener('change', guardarColores);
colorVisitanteInput.addEventListener('change', guardarColores);

// Guardar puntos y estado partido al cambiar puntos o finalizar
[btnLocalMas, btnLocalMenos, btnVisitanteMas, btnVisitanteMenos, btnInvertir, btnFinalizar, btnReiniciar].forEach(btn => {
    btn.addEventListener('click', guardarTodo);
});

// Atajos de teclado:
// L: + local, Shift+L: - local
// V: + visitante, Shift+V: - visitante
// I: invertir
// F: finalizar
// R: reiniciar
document.addEventListener('keydown', (e) => {
    if (e.target.isContentEditable || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const key = e.key.toLowerCase();
    const shift = e.shiftKey;

    if (key === 'l') {
        if (shift) {
            btnLocalMenos.click();
        } else {
            btnLocalMas.click();
        }
        e.preventDefault();
    } else if (key === 'v') {
        if (shift) {
            btnVisitanteMenos.click();
        } else {
            btnVisitanteMas.click();
        }
        e.preventDefault();
    } else if (key === 'i') {
        btnInvertir.click();
        e.preventDefault();
    } else if (key === 'f') {
        btnFinalizar.click();
        e.preventDefault();
    } else if (key === 'r') {
        btnReiniciar.click();
        e.preventDefault();
    }
});

// Inicializar
cargarNombres();
cargarColores();
cargarPuntos();