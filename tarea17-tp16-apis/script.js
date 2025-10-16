const pokedexEl = document.getElementById('pokedex');
const spinnerEl = document.getElementById('spinner');
const btnCargarMas = document.getElementById('btn-cargar-mas');
const modalInfo = new bootstrap.Modal(document.getElementById('modalInfo'));
const modalBody = document.getElementById('modal-body');
const modalTitle = document.getElementById('modalInfoLabel');

let offset = 0;
const limit = 151;
const batchSize = 50; // para cargar más en bloques

// Mostrar spinner
function mostrarSpinner() {
    spinnerEl.classList.remove('d-none');
}
// Ocultar spinner
function ocultarSpinner() {
    spinnerEl.classList.add('d-none');
}

// Obtener lista de Pokémon con offset y limit
async function obtenerListaPokemons(offset, limit) {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error al obtener lista de Pokémon');
    const data = await res.json();
    return data.results; // array con {name, url}
}

// Obtener detalles de un Pokémon por URL
async function obtenerDetallesPokemon(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error al obtener detalles de Pokémon');
    return await res.json();
}

// Crear carta Pokémon
function crearCartaPokemon(pokemon) {
    const col = document.createElement('div');
    col.className = 'col';

    const card = document.createElement('div');
    card.className = 'card card-pokemon h-100 shadow-sm';

    // Imagen
    const img = document.createElement('img');
    img.className = 'card-img-top mx-auto mt-3';
    img.style.width = '120px';
    img.style.height = '120px';
    img.alt = pokemon.name;
    img.src = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default || '';

    // Card body
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body d-flex flex-column';

    // Nombre
    const nombre = document.createElement('h5');
    nombre.className = 'card-title text-center text-capitalize';
    nombre.textContent = pokemon.name;

    // Tipos
    const tiposDiv = document.createElement('div');
    tiposDiv.className = 'mb-3 text-center';
    pokemon.types.forEach(t => {
        const span = document.createElement('span');
        span.className = `tipo tipo-${t.type.name}`;
        span.textContent = t.type.name;
        tiposDiv.appendChild(span);
    });

    // Botón info
    const btnInfo = document.createElement('button');
    btnInfo.className = 'btn btn-outline-primary mt-auto';
    btnInfo.textContent = 'Ver más info';
    btnInfo.setAttribute('aria-label', `Ver más información de ${pokemon.name}`);
    btnInfo.addEventListener('click', () => mostrarInfoPokemon(pokemon));

    cardBody.appendChild(nombre);
    cardBody.appendChild(tiposDiv);
    cardBody.appendChild(btnInfo);

    card.appendChild(img);
    card.appendChild(cardBody);
    col.appendChild(card);

    return col;
}

// Mostrar info en modal
function mostrarInfoPokemon(pokemon) {
    modalTitle.textContent = `Información de ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}`;
    modalBody.innerHTML = '';

    // Imagen grande
    const img = document.createElement('img');
    img.src = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default || '';
    img.alt = pokemon.name;
    img.className = 'img-fluid mx-auto d-block mb-3';
    img.style.maxHeight = '200px';
    modalBody.appendChild(img);

    // Tipos
    const tipos = document.createElement('p');
    tipos.innerHTML = `<strong>Tipos:</strong> ${pokemon.types.map(t => t.type.name).join(', ')}`;
    modalBody.appendChild(tipos);

    // Habilidades (al menos una)
    const habilidades = document.createElement('p');
    habilidades.innerHTML = `<strong>Habilidades:</strong> ${pokemon.abilities.map(a => a.ability.name).join(', ')}`;
    modalBody.appendChild(habilidades);

    // Movimientos (mostrar hasta 4)
    const movimientos = document.createElement('p');
    const movs = pokemon.moves.slice(0, 4).map(m => m.move.name);
    movimientos.innerHTML = `<strong>Movimientos:</strong> ${movs.join(', ')}`;
    modalBody.appendChild(movimientos);

    modalInfo.show();
}

// Cargar y mostrar Pokémon (offset, limit)
async function cargarPokemons(offset, limit) {
    try {
        mostrarSpinner();
        btnCargarMas.disabled = true;
        const lista = await obtenerListaPokemons(offset, limit);
        // Obtener detalles en paralelo (limitado a 20 a la vez para no saturar)
        const detalles = [];
        for (let i = 0; i < lista.length; i += 20) {
            const batch = lista.slice(i, i + 20);
            const promesas = batch.map(p => obtenerDetallesPokemon(p.url));
            const resBatch = await Promise.all(promesas);
            detalles.push(...resBatch);
        }
        detalles.forEach(pokemon => {
            const card = crearCartaPokemon(pokemon);
            pokedexEl.appendChild(card);
        });
        btnCargarMas.disabled = false;
    } catch (error) {
        alert('Error cargando Pokémon: ' + error.message);
    } finally {
        ocultarSpinner();
    }
}

// Evento botón cargar más
btnCargarMas.addEventListener('click', () => {
    offset += batchSize;
    cargarPokemons(offset, batchSize);
});

// Carga inicial
cargarPokemons(offset, limit);