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
// Variable pour suivre les Pokémon capturés
let capturedPokemons = [];

// Fonction pour vider la sidebar
function clearSidebar() {
  const listePokemonsCaptures = document.querySelector(
    ".liste_pokemons_captures"
  );
  listePokemonsCaptures.innerHTML = "";
}

// Fonction pour ajouter un Pokémon capturé à la sidebar
function addCapturedPokemon(pokemon) {
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
function handleCellClick(event) {
  const cell = event.target.closest(".col.box");
  if (!cell || !cell.querySelector(".bush") || selectedBuissons.length >= 2)
    return;

  // Vérifier si le Pokémon a déjà été révélé et ne pas permettre un clic
  const bush = cell.querySelector(".bush");
  const pokemonImg = cell.querySelector(".pokemon");

  if (pokemonImg.style.display === "block") return; // Ne pas permettre de cliquer sur un Pokémon déjà révélé

  selectedBuissons.push(cell);

  bush.style.opacity = "0";
  pokemonImg.style.display = "block";

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

      addCapturedPokemon({ name: firstPokemon.alt, sprite: firstPokemon.src });
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

// Fonction pour vérifier si l'utilisateur a gagné
function checkWinCondition() {
  if (capturedPokemons.length === 6) {
    // Si tous les Pokémon sont capturés, afficher le bouton de rejouer
    const rejouerButton = document.getElementById("rejouer");
    rejouerButton.style.display = "block";

    // Vérifier et mettre à jour le record
    updateRecord();
  }
}

// Fonction pour mettre à jour le record
function updateRecord() {
  const storedRecord = localStorage.getItem("pokemon_record");
  if (!storedRecord || nombreDeCoups < storedRecord) {
    // Si le nombre de coups actuel est meilleur que le record ou s'il n'y a pas de record, on met à jour
    localStorage.setItem("pokemon_record", nombreDeCoups);
    document.getElementById("stat_nombre_de_coups").textContent = nombreDeCoups;
  }
}

// Fonction pour recommencer le jeu
function restartGame() {
  // Réinitialiser le nombre de coups et les Pokémon capturés
  nombreDeCoups = 0;
  capturedPokemons = [];
  document.getElementById("stat_nombre_de_coups").textContent = nombreDeCoups;

  // Cacher le bouton de rejouer
  document.getElementById("rejouer").style.display = "none";

  // Relancer le jeu
  main();
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
  clearSidebar();

  // Etape 4: au tour de l'utilisateur de jouer
  // Initialisation des interactions de l'utilisateur
  document.querySelectorAll(".col.box").forEach((cell) => {
    cell.addEventListener("click", handleCellClick);
  });

  // Mettre à jour le record affiché au début du jeu
  const storedRecord = localStorage.pokemon_record;
  console.log(localStorage)
  if (storedRecord) {
    document.getElementById("record").textContent = storedRecord;
  }
}

// Démarrer le jeu
main();

// Ajouter un gestionnaire pour le bouton "Rejouer"
document.getElementById("rejouer").addEventListener("click", restartGame);
