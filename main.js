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

// Variable pour garder la trace des buissons sélectionnés
let selectedBuissons = [];
// Fonction de jeu principale
function handleCellClick(event) {
  console.log("click");
  // On vérifie si la cellule est bien un buisson
  const cell = event.target.closest(".col.box");
  if (!cell || !cell.querySelector(".bush")) return;

  // Si on a déjà deux buissons, on ne fait rien, on créera une fonction pour gérer ça après
  if (selectedBuissons.length >= 2) return;

  // Ajouter la cellule sélectionnée à la liste des buissons sélectionnés
  selectedBuissons.push(cell);

  // Afficher le Pokémon caché derrière le buisson
  const bush = cell.querySelector(".bush");
  const pokemonImg = cell.querySelector(".pokemon");

  // On cache le buisson et on affiche le Pokémon
  bush.style.opacity = "0";
  pokemonImg.style.display = "block";

  // Si deux buissons ont été sélectionnés
  if (selectedBuissons.length === 2) {
    // Vérifier si les deux Pokémon sont identiques
    const [firstCell, secondCell] = selectedBuissons;
    const firstPokemon = firstCell.querySelector(".pokemon");
    const secondPokemon = secondCell.querySelector(".pokemon");

    if (firstPokemon.alt === secondPokemon.alt) {
      // Si les Pokémon sont identiques, les laisser visibles
      console.log("Les Pokémon sont identiques !");
    } else {
      // Si les Pokémon ne sont pas identiques, les cacher à nouveau après un délai
      setTimeout(() => {
        firstCell.querySelector(".bush").style.opacity = "1";
        secondCell.querySelector(".bush").style.opacity = "1";
        firstPokemon.style.display = "none";
        secondPokemon.style.display = "none";
      }, 1000); 
    }

    // Réinitialiser la sélection
    selectedBuissons = [];
  }
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

  // Etape 4: au tour de l'utilisateur de jouer
  // Initialisation des interactions de l'utilisateur
  document.querySelectorAll(".col.box").forEach((cell) => {
    cell.addEventListener("click", handleCellClick);
  });
}

// Démarrer le jeu
main();
