import { initializeGrid } from "./display.js";
// Fonction de sauvegarde de la partie
let capturedPokemons = [];

export function saveGame() {
  const nombreDeCoups = parseInt(
    document.querySelector("#stat_nombre_de_coups").innerText
  );
  const capturedPokemons = Array.from(
    document.querySelectorAll(".liste_pokemons_captures img")
  ).map((img) => ({ name: img.alt, sprite: img.src }));

  const gameState = {
    nombreDeCoups,
    capturedPokemons,
    gridSetup: Array.from(
      document.querySelectorAll(".col.box"),
      (cell, index) => {
        const pokemonImg = cell.querySelector(".pokemon");
        let state = "hidden"; 
        if (pokemonImg && pokemonImg.style.display === "block") {
          state = "revealed";
        }
        const caught = capturedPokemons.some(
          (pokemon) => pokemon.name === pokemonImg.alt
        );
        return {
          position: index,
          pokemon:
            pokemonImg && pokemonImg.src
              ? { name: pokemonImg.alt, sprite: pokemonImg.src }
              : null,
          state: caught ? "caught" : state, // Set state to 'caught' if the Pokémon is captured
        };
      }
    ),
  };
  localStorage.setItem("pokemon_save", JSON.stringify(gameState));
}

// Fonction pour charger une partie sauvegardée
export function loadSave() {
  const savedData = localStorage.getItem("pokemon_save");
  if (!savedData || JSON.parse(savedData).nombreDeCoups == 0) return false; 
  let {
    nombreDeCoups: savedCoups,
    capturedPokemons: savedCaptured,
    gridSetup: savedGrid,
  } = JSON.parse(savedData);
  let lastReveal = 0;

  capturedPokemons = savedCaptured;
  savedGrid.forEach((cell) => {
    if (cell.state == "revealed") {
      cell.state = "hidden";
      lastReveal++;
    }
  });
  if (lastReveal != 0) savedCoups += 1;
  document.getElementById("stat_nombre_de_coups").textContent = savedCoups;
  initializeGrid(savedGrid);

  if (capturedPokemons) {
    capturedPokemons.forEach((pokemon) => {
      if (!capturedPokemons.some((p) => p.name === pokemon.name)) {
        addCapturedPokemon(pokemon);
      }
    });
  }

  document.querySelectorAll(".col.box").forEach((cell, index) => {
    const savedState = savedGrid.find((item) => item.position === index);
    if (savedState) {
      const bush = cell.querySelector(".bush");
      const pokemonImg = cell.querySelector(".pokemon");

      switch (savedState.state) {
        case "revealed":
          bush.style.opacity = "0";
          pokemonImg.style.display = "block";
          break;
        case "caught":
          bush.style.opacity = "0";
          pokemonImg.style.display = "block";

          break;
        case "hidden":
        default:
          bush.style.opacity = "1";
          pokemonImg.style.display = "none";
          break;
      }
    }
  });
  return true;
}
