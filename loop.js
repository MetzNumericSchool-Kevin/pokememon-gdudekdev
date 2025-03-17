import { saveGame } from "./save.js";
import { updateRecord } from "./display.js";

let capturedPokemons = [];
let selectedBuissons = [];
let nombreDeCoups = 0;
localStorage.getItem("pokemon_save")
  ? (nombreDeCoups = JSON.parse(
      localStorage.getItem("pokemon_save")
    ).nombreDeCoups)
  : (nombreDeCoups = 0);

// Fonction pour ajouter un Pokémon capturé à la sidebar
export function addCapturedPokemon(pokemon) {
  if (capturedPokemons.some((p) => p.name === pokemon.name)) return;

  const listePokemonsCaptures = document.querySelector(
    ".liste_pokemons_captures"
  );

  const pokemonImg = document.createElement("img");
  pokemonImg.src = pokemon.sprite;
  pokemonImg.alt = pokemon.name;

  listePokemonsCaptures.appendChild(pokemonImg);
  capturedPokemons.push(pokemon);
  checkWinCondition();
}

// Fonction de gestion du clic sur les cellules

let isClickable = false;

export function handleCellClick(cell) {
      if (isClickable) return;
   
      if (!cell || !cell.querySelector(".bush") || selectedBuissons.length >= 2) return;
    
      const cellState = cell.getAttribute("data-state");
      if (cellState === "revealed" || cellState === "caught") return;
    
      const bush = cell.querySelector(".bush");
      const pokemonImg = cell.querySelector(".pokemon");
    
      selectedBuissons.push(cell);
      bush.style.opacity = "0";
      pokemonImg.style.display = "block";
    
      if (selectedBuissons.length === 2) {
        const [firstCell, secondCell] = selectedBuissons;
        const firstPokemon = firstCell.querySelector(".pokemon");
        const secondPokemon = secondCell.querySelector(".pokemon");
    
        isClickable = true;
    
        if (firstPokemon.alt === secondPokemon.alt) {
          let pokeball = document.createElement("img");
          pokeball.src = "./assets/pokeball.png";
          pokeball.alt = "Pokéball";
          pokeball.classList.add("pokeball");
    
          const clonedPokeball1 = pokeball.cloneNode(true);
          firstCell.appendChild(clonedPokeball1);
          firstCell.setAttribute("data-state", "caught"); 
          const clonedPokeball2 = pokeball.cloneNode(true);
          secondCell.appendChild(clonedPokeball2);
          secondCell.setAttribute("data-state", "caught");

          isClickable = false;
    
          addCapturedPokemon({ name: firstPokemon.alt, sprite: firstPokemon.src });
        } else {
          setTimeout(() => {
            firstCell.querySelector(".bush").style.opacity = "1";
            secondCell.querySelector(".bush").style.opacity = "1";
            firstPokemon.style.display = "none";
            secondPokemon.style.display = "none";
            firstCell.setAttribute("data-state", "hidden");
            secondCell.setAttribute("data-state", "hidden"); 
            isClickable = false;
          }, 1000);
        }
        nombreDeCoups++;
        saveGame();
        selectedBuissons = [];
        document.getElementById("stat_nombre_de_coups").textContent = nombreDeCoups;
      }
    }
    

// Fonction pour vérifier si l'utilisateur a gagné
function checkWinCondition() {
  if (capturedPokemons.length === 6) {
    updateRecord();
  }
}
