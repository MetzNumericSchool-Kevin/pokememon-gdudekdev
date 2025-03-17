import { getRandomElements, shuffleArray } from "./utils.js";
import { addCapturedPokemon } from "./loop.js";
export function rdPokemon(recordset, int) {
  return getRandomElements(recordset, int);
}

// Fonction de génération de la grille dépendant de la taille du gameset
export function gridPokemon(gameset) {
  const duplicatedGameset = [...gameset, ...gameset]; 

  const gridPositions = Array.from(
    { length: gameset.length * 2 },
    (_, index) => index
  );

  shuffleArray(gridPositions);

  return gridPositions.map((pos, index) => ({
    position: pos,
    pokemon: duplicatedGameset[index],
    state: "hidden",
  }));
}

export function updateBushes(gridSize) {
  const gridContainer = document.querySelector("#grille_de_jeu ");
  gridContainer.innerHTML = "";

  gridContainer.classList.add("row", "row-cols-4"); 

  for (let i = 0; i < gridSize * 2; i++) {
    const cell = document.createElement("div");
    cell.classList.add("col", "box");

    const bushImg = document.createElement("img");
    bushImg.src = "./assets/bush.webp";
    bushImg.alt = "Bush";
    bushImg.classList.add("bush");

    const pokemonImg = document.createElement("img");
    pokemonImg.classList.add("pokemon");
    pokemonImg.style.display = "none"; 

    cell.appendChild(bushImg);
    cell.appendChild(pokemonImg);
    gridContainer.appendChild(cell);
  }
}

export function initializeGrid(gridSetup) {
  const gridCells = document.querySelectorAll("#grille_de_jeu .col.box");

  gridCells.forEach((cell) => {
    const existingImages = cell.querySelectorAll("img");
    existingImages.forEach((img) => {
      img.remove();
    });
  });

  gridCells.forEach((cell) => {
    const bushImg = document.createElement("img");
    bushImg.src = "./assets/bush.webp";
    bushImg.alt = "Bush";
    bushImg.classList.add("bush");
    cell.appendChild(bushImg);

    const pokemonImg = document.createElement("img");
    pokemonImg.classList.add("pokemon");
    pokemonImg.style.display = "none";
    cell.appendChild(pokemonImg);
  });

  gridSetup.forEach((item) => {
    const { position, pokemon, state } = item;
    if (pokemon && position >= 0 && position < gridCells.length) {
      const { sprite, name } = pokemon;
      const cell = gridCells[position];

      if (cell) {
        const pokemonImg = cell.querySelector("img.pokemon");

        if (pokemonImg) {
          pokemonImg.src = sprite;
          pokemonImg.alt = name;

          const bush = cell.querySelector(".bush");
          switch (state) {
            case "revealed":
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
          cell.setAttribute("data-state", state);
        }
      }
    }
  });
}

// Fonction pour vider la sidebar
export function clearSidebar() {
  const listePokemonsCaptures = document.querySelector(
    ".liste_pokemons_captures"
  );
  listePokemonsCaptures.innerHTML = "";
}
// Fonction pour remplir la sidebar si sauvegarde il y a 
export function fillSidebar() {
  const savedData = localStorage.getItem("pokemon_save");
  const listePokemonsCaptures = document.querySelector(
    ".liste_pokemons_captures"
  );
  listePokemonsCaptures.innerHTML = "";
  let { capturedPokemons: savedCaptured } = JSON.parse(savedData);
  if (savedCaptured){

    savedCaptured.forEach((pokemon) => {
      addCapturedPokemon(pokemon);
    });
  }
}

// Fonction pour mettre à jour le record
export function updateRecord() {
  const storedRecord = localStorage.getItem("pokemon_record");
  if (storedRecord==0 || nombreDeCoups < storedRecord || storedRecord == 0) {
    localStorage.setItem("pokemon_record", nombreDeCoups);
    document.getElementById("record").textContent = nombreDeCoups;
  }
}

export function handleSlider(recordset, updateGame) {
  const slider = document.querySelector("#slider");
  const sliderValue = document.querySelector("#sliderValue p");

  slider.setAttribute("min", 2);
  slider.setAttribute("max", recordset.length);
  slider.step = 1;
  sliderValue.innerText = slider.value;

  slider.addEventListener("input", () => {
    const newGameSetSize = parseInt(slider.value, 10);
    sliderValue.innerText = newGameSetSize;

    updateBushes(newGameSetSize);
    updateGame(recordset, newGameSetSize);
  });
}

