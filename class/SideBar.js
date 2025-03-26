class Sidebar {
  constructor(gameState) {
    this.gameState = gameState
    this.sidebar = document.querySelector(".liste_pokemons_captures");
    this.init(this.gameState);
  }

  init(gameState) {
    this.sidebar.innerHTML = "";
    gameState.pokemonCaught.forEach((pokemon) => {
      const pokemonImg = document.createElement("img");
      pokemonImg.classList.add("pokemon");

      const { name, sprite } = pokeAmon;
      pokemonImg.alt = name;
      pokemonImg.src = sprite;
      this.sidebar.appendChild(pokemonImg);
    });
  }
  addCaughtPokemon(pokemon){
      const pokemonImg = document.createElement("img");
      pokemonImg.classList.add("pokemon");

      const { name, sprite } = pokemon;
      pokemonImg.alt = name;
      pokemonImg.src = sprite;
      this.sidebar.appendChild(pokemonImg);
  }
}
export default Sidebar;