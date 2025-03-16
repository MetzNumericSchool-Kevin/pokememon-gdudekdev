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
  const duplicatedGameset = [...gameset, ...gameset];
  const gridPositions = new Set();

  while (gridPositions.size < duplicatedGameset.length) {
    gridPositions.add(Math.floor(Math.random() * 12));
  }

  return [...gridPositions].map((pos, index) => ({
    position: pos,
    pokemon: duplicatedGameset[index],
  }));
}

// Boucle principale du jeu
async function main() {
  const recordset = await getData();
  if (!recordset) return;

  // Étape 1: Choisir 6 Pokémon au hasard
  const gameset = rdPokemon(recordset);
  console.log("Pokémon sélectionnés :", gameset);

  // Étape 2: Placer ces Pokémon aléatoirement sur une grille 4x3
  const gridSetup = gridPokemon(gameset);
  console.log("Placement des Pokémon :", gridSetup);
}

// Démarrer le jeu
main();
