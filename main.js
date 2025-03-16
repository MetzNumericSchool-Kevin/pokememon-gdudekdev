// Récupération des données du json
async function getData() {
  try {
    const response = await fetch("http://localhost:5500/data/pokemon.json");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
  }
}

(async () => {
  const recordset = await getData();
  console.log(recordset);
})();


// Fonction du choix des Pokémon parmis le dataset
// On a besoin de pouvoir choisir p éléments dans un tableau à n éléments sans répétitions

function getRandomElements(arr, n) {
  const selected = new Set();// Set permet d'éviter les répétitions
  while (selected.size < n) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    selected.add(arr[randomIndex]);
  }
  return [...selected];
}


function rdPokemon(recordset) {
  return getRandomElements(recordset,6);
}
// A priori on a bien 6 pokemon différents lors de l'appel de la fonction

// Création de la boucle de jeu
function main() {
      // Etape 1: Choisir les pokemons qui vont apparaitre dans le jeu de manière aléatoire (6 pokemon par partie)
      const gameset = rdPokemon(recordset);
      
}