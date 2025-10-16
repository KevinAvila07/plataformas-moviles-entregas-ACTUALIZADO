const texto = document.getElementById('texto');
const inputTexto = document.getElementById('input-texto');
const btnNegrita = document.getElementById('btn-negrita');
const btnCursiva = document.getElementById('btn-cursiva');
const btnSubrayado = document.getElementById('btn-subrayado');
const btnColor = document.getElementById('btn-color');
const inputTamano = document.getElementById('input-tamano');
const btnReset = document.getElementById('btn-reset');

// Inicializar textarea con el texto actual
inputTexto.value = texto.textContent;

// Sincronizar textarea con el párrafo
inputTexto.addEventListener('input', () => {
    texto.textContent = inputTexto.value;
});

// Estado de estilos
const estadoEstilos = {
    negrita: false,
    cursiva: false,
    subrayado: false,
    colorIndex: 0,
    colores: ['black', 'red', 'blue', 'green', 'purple']
};

function actualizarBotonEstado() {
    // Negrita
    if (estadoEstilos.negrita) {
        btnNegrita.classList.add('active');
        btnNegrita.setAttribute('aria-pressed', 'true');
    } else {
        btnNegrita.classList.remove('active');
        btnNegrita.setAttribute('aria-pressed', 'false');
    }
    // Cursiva
    if (estadoEstilos.cursiva) {
        btnCursiva.classList.add('active');
        btnCursiva.setAttribute('aria-pressed', 'true');
    } else {
        btnCursiva.classList.remove('active');
        btnCursiva.setAttribute('aria-pressed', 'false');
    }
    // Subrayado
    if (estadoEstilos.subrayado) {
        btnSubrayado.classList.add('active');
        btnSubrayado.setAttribute('aria-pressed', 'true');
    } else {
        btnSubrayado.classList.remove('active');
        btnSubrayado.setAttribute('aria-pressed', 'false');
    }
    // Color
    if (estadoEstilos.colorIndex === 0) {
        btnColor.classList.remove('active');
        btnColor.setAttribute('aria-pressed', 'false');
    } else {
        btnColor.classList.add('active');
        btnColor.setAttribute('aria-pressed', 'true');
    }
}

function aplicarEstilos() {
    texto.style.fontWeight = estadoEstilos.negrita ? 'bold' : 'normal';
    texto.style.fontStyle = estadoEstilos.cursiva ? 'italic' : 'normal';
    texto.style.textDecoration = estadoEstilos.subrayado ? 'underline' : 'none';
    texto.style.color = estadoEstilos.colores[estadoEstilos.colorIndex];
}

function funcionNegrita() {
    estadoEstilos.negrita = !estadoEstilos.negrita;
    aplicarEstilos();
    actualizarBotonEstado();
}

function funcionCursiva() {
    estadoEstilos.cursiva = !estadoEstilos.cursiva;
    aplicarEstilos();
    actualizarBotonEstado();
}

function funcionSubrayado() {
    estadoEstilos.subrayado = !estadoEstilos.subrayado;
    aplicarEstilos();
    actualizarBotonEstado();
}

function funcionColor() {
    estadoEstilos.colorIndex = (estadoEstilos.colorIndex + 1) % estadoEstilos.colores.length;
    aplicarEstilos();
    actualizarBotonEstado();
}

function cambiarTamano() {
    let valor = parseInt(inputTamano.value);
    if (isNaN(valor) || valor < 10) valor = 10;
    if (valor > 72) valor = 72;
    inputTamano.value = valor;
    texto.style.fontSize = valor + 'px';
}

function resetearEstilos() {
    estadoEstilos.negrita = false;
    estadoEstilos.cursiva = false;
    estadoEstilos.subrayado = false;
    estadoEstilos.colorIndex = 0;
    aplicarEstilos();
    actualizarBotonEstado();
    inputTamano.value = 16;
    texto.style.fontSize = '16px';
    inputTexto.value = '';
    texto.textContent = '';
}

function handlerBoton(e) {
    const funcionBoton = e.target.dataset.formato;
    switch (funcionBoton) {
        case 'negrita':
            funcionNegrita();
            break;
        case 'cursiva':
            funcionCursiva();
            break;
        case 'subrayado':
            funcionSubrayado();
            break;
        case 'color':
            funcionColor();
            break;
    }
}

document.querySelectorAll('button.btn').forEach(e => e.addEventListener('click', handlerBoton));
inputTamano.addEventListener('input', cambiarTamano);
btnReset.addEventListener('click', resetearEstilos);

// Inicializar estilos y tamaño
aplicarEstilos();
actualizarBotonEstado();
cambiarTamano();