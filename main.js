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
// Variable pour le nombre de coups
let nombreDeCoups = 0;

function handleCellClick(event) {
  // Ne pas procéder si la cellule ne contient pas de buisson
  const cell = event.target.closest(".col.box"); 
  if (!cell || !cell.querySelector(".bush") || selectedBuissons.length >= 2)
    return;

  // Ajouter la cellule sélectionnée à la liste des buissons sélectionnés
  selectedBuissons.push(cell);

  // Afficher le Pokémon caché derrière le buisson (si non déjà affiché)
  const bush = cell.querySelector(".bush");
  const pokemonImg = cell.querySelector(".pokemon");

  // On cache le buisson et on affiche le Pokémon
  bush.style.opacity = "0";
  pokemonImg.style.display = "block";

  // Si deux buissons ont été sélectionnés
  if (selectedBuissons.length === 2) {
    
    const [firstCell, secondCell] = selectedBuissons;
    const firstPokemon = firstCell.querySelector(".pokemon");
    const secondPokemon = secondCell.querySelector(".pokemon");


    if (firstPokemon.alt === secondPokemon.alt) {
      let pokeball = document.createElement("img");
      pokeball.src = "./assets/pokeball.png";
      pokeball.alt = "Pokéball";
      pokeball.classList.add("pokeball");

      const clonedPokeball1 = pokeball.cloneNode(true);
      firstCell.appendChild(clonedPokeball1); 

      const clonedPokeball2 = pokeball.cloneNode(true);
      secondCell.appendChild(clonedPokeball2); 
    } else {

      setTimeout(() => {
        firstCell.querySelector(".bush").style.opacity = "1";
        secondCell.querySelector(".bush").style.opacity = "1";
        firstPokemon.style.display = "none";
        secondPokemon.style.display = "none";
      }, 1000);
    }
    selectedBuissons = [];

    nombreDeCoups++;
    document.getElementById("stat_nombre_de_coups").textContent = nombreDeCoups;
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
