// Récupération des données du JSON
async function getData() {
  try {
    const response = await fetch("http://localhost:5500/data/pokemon.json");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
  }
}

// Fonction pour mélanger un tableau
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// Fonction pour choisir `n` Pokémon aléatoires sans répétition
function getRandomElements(arr, n) {
  const selected = new Set();
  while (selected.size < n) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    selected.add(arr[randomIndex]);
  }
  return [...selected];
}

function rdPokemon(recordset) {
  return getRandomElements(recordset, 6);
}

// Fonction pour choisir la position des Pokémon sur une grille 4x3
function gridPokemon(gameset) {
  const duplicatedGameset = [...gameset, ...gameset]; // Chaque Pokémon apparaît deux fois

  shuffleArray(duplicatedGameset);

  // Générer un tableau de 12 positions uniques (0 à 11)
  const gridPositions = Array.from({ length: 12 }, (_, index) => index);

  shuffleArray(gridPositions);

  // Assigner les Pokémon aux positions
  return gridPositions.map((pos, index) => ({
    position: pos,
    pokemon: duplicatedGameset[index],
  }));
}

// Initialisation de la grille de jeu
function initializeGrid(gridSetup) {
  const gridCells = document.querySelectorAll("#grille_de_jeu .col.box");

  // Supprimer toutes les images existantes dans les cellules
  gridCells.forEach((cell) => {
    const existingImages = cell.querySelectorAll("img");
    existingImages.forEach((img) => {
      img.remove();
    });
  });

  gridCells.forEach((cell) => {
    // Ajout des buissons (display none par defaut)
    const bushImg = document.createElement("img");
    bushImg.src = "./assets/bush.webp";
    bushImg.alt = "Bush";
    bushImg.classList.add("bush");
    cell.appendChild(bushImg);

    // Ajout des pokemons selon le gridSetup
    const pokemonImg = document.createElement("img");
    pokemonImg.classList.add("pokemon");
    pokemonImg.style.display = "none";
    cell.appendChild(pokemonImg);
  });

  gridSetup.forEach((item) => {
    const { position, pokemon } = item;
    const { sprite, name } = pokemon;

    const cell = gridCells[position];

    const pokemonImg = cell.querySelector("img.pokemon");

    pokemonImg.src = sprite;
    pokemonImg.alt = name;
  });
}

// Boucle principale du jeu
async function main() {
  const recordset = await getData();
  if (!recordset) return;

  // Étape 1: Choisir 6 Pokémon au hasard
  const gameset = rdPokemon(recordset);

  // Étape 2: Placer ces Pokémon aléatoirement sur une grille 4x3
  const gridSetup = gridPokemon(gameset);

  // Etape 3: Initialisation de la grille
  initializeGrid(gridSetup);
}

// Démarrer le jeu
main();
