const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
const maxRecords = 151;
const limit = 10;
let offset = 0;

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    pokemonList.innerHTML += pokemons.map((pokemon) =>
      `<li class="pokemon ${pokemon.type}">
        <span class="number">#${pokemon.number}</span>
        <span class="name">${pokemon.name}</span>
        <div class="detail">
          <ol class="types">${pokemon.types.map((type) =>
            `<li class="type ${type}">${type}</li>`).join("")}
          </ol>
          <img src="${pokemon.photo}" alt="${pokemon.name}">
        </div>
      </li>`
    ).join("");
  });
}

function createPokemonCard(pokemon) {
    return `
      <li class="pokemon ${pokemon.type}" onclick="openPokemonDetail(${pokemon.number})">
      <span class="number">#${pokemon.number}</span>
      <span class="name">${pokemon.name}</span>
      <div class="detail">
        <ol class="types">${pokemon.types.map((type) =>
          `<li class="type ${type}">${type}</li>`).join("")}
        </ol>
        <img src="${pokemon.photo}" alt="${pokemon.name}">
      </div>
    </li>
  `;
}

function createPokemonDetailCard(pokemon) {
  return `
    <div class="pokemon-detail ${pokemon.type}">
      <button type="button" class="close-button" onclick="closePokemonDetail()">×</button>
      <div class="detail-header">
        <div>
          <h2 class="name">${pokemon.name}</h2>
          <ol class="types">${pokemon.types.map((type) =>
            `<li class="type ${type}">${type}</li>`).join("")}
          </ol>
        </div>
        <span class="number">#${pokemon.number}</span>
      </div>
      <div class="detail-content">
        <div class="pokemon-image">
          <img src="${pokemon.photo}" alt="${pokemon.name}">
        </div>
        <div class="pokemon-info">
          <div class="basic-info">
            <p><strong>Height:</strong> ${pokemon.height} m</p>
            <p><strong>Weight:</strong> ${pokemon.weight} kg</p>
            <p><strong>Abilities:</strong> ${pokemon.abilities.join(", ")}</p>
          </div>
          <div class="stats-info">
            <h3>Base Stats</h3>
              ${Object.entries(pokemon.stats).map(([statName, value]) => {
                const width = (value / 180) * 100;
                return `
                <div class="stat-row">
                  <span class="stat-name">${statName}</span>
                  <div class="stat-bar">
                    <div class="stat-fill animate" style="--final-width: ${width}%; width: ${width}%;">${value}</div>
                  </div>
                </div>`;
              }).join("")}
          </div>
        </div>
      </div>
    </div>
  `;
}

function closePokemonDetail() {
  const detailSection = document.getElementById("pokemonDetail");
  detailSection.classList.remove("open");
}

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    pokemonList.innerHTML += pokemons.map(createPokemonCard).join("");
  });
}

function openPokemonDetail(pokemonNumber) {
  pokeApi.getPokemonByNumber(pokemonNumber).then((pokemon) => {
    const detailSection = document.getElementById("pokemonDetail");
    detailSection.innerHTML = createPokemonDetailCard(pokemon);
    detailSection.classList.add("open");
    document.body.classList.add('modal-open'); // Adiciona classe ao body
  });
}

function closePokemonDetail() {
  const detailSection = document.getElementById("pokemonDetail");
  detailSection.classList.remove("open");
  document.body.classList.remove('modal-open'); // Remove classe do body
}
loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordWithNextPage = offset + limit;

  if (qtdRecordWithNextPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);
    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});
