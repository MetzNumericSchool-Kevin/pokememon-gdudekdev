import { handleCellClick } from "./loop.js";
import { loadSave } from "./save.js";
import {
  fillSidebar,
  clearSidebar,
  rdPokemon,
  handleSlider,
  updateBushes,
  gridPokemon,
  initializeGrid,
} from "./display.js";
import { getData } from "./utils.js";

// Fonction pour recommencer le jeu
function restartGame() {
  const gameState = {
    nombreDeCoups: 0,
    selectedBuissons: [],
    gridSetup: Array.from(
      document.querySelectorAll(".col.box"),
      (cell, index) => {
        const pokemonImg = cell.querySelector(".pokemon");
        return {
          position: index,
          pokemon:
            pokemonImg && pokemonImg.src
              ? { name: pokemonImg.alt, sprite: pokemonImg.src }
              : null,
          revealed: pokemonImg && pokemonImg.style.display === "block",
        };
      }
    ),
  };


  localStorage.setItem("pokemon_save", JSON.stringify(gameState));
  document.getElementById("stat_nombre_de_coups").textContent = 0;

  const grilleDeJeu = document.querySelector("#grille_de_jeu");
  const clonedGrille = grilleDeJeu.cloneNode(true); // Clone la grille sans les écouteurs d'événements
  grilleDeJeu.parentNode.replaceChild(clonedGrille, grilleDeJeu); // Remplace l'élément de la grille

  const slider = document.querySelector("#slider");
  const clonedSlider = slider.cloneNode(true); // Clone le slider sans les écouteurs d'événements
  slider.parentNode.replaceChild(clonedSlider, slider); // Remplace l'élément du slider

  main();
}

// Fonction principale pour démarrer le jeu
async function main() {
  if (loadSave()) {
    fillSidebar();
  } else {
    clearSidebar();
    const recordset = await getData();
    if (!recordset) return;

    const updateGame = (recordset, size) => {
      const gameset = rdPokemon(recordset, size);
      const gridSetup = gridPokemon(gameset);
      initializeGrid(gridSetup);
    };
    handleSlider(recordset, updateGame);
    const initialSize = parseInt(document.querySelector("#slider").value, 10);
    updateBushes(initialSize);
    updateGame(recordset, initialSize);
  }

  const storedRecord = localStorage.getItem("pokemon_record");
  const record = document.getElementById("record");
  if (storedRecord) record.innerText = storedRecord;

  const grilleDeJeu = document.querySelector("#grille_de_jeu");
  grilleDeJeu.addEventListener("click", (event) => {
    if (event.target) {
      const cell = event.target.closest(".col.box");
      if (cell) {
        handleCellClick(cell);
      }
    }
  });

  const slider = document.querySelector("#slider");
  slider.addEventListener("input", () => {
    restartGame();
  });
}

main();

document.getElementById("rejouer").addEventListener("click", restartGame);
