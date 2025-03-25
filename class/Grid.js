class GameGrid {
  constructor(gameState) {
    this.gameState = gameState;
    this.boxList = []; // Déclare boxList ici pour qu'il soit accessible dans toutes les méthodes
    this.init();
  }

  // Méthode pour ajouter les écouteurs d'événements aux éléments
  setEventListener() {
    this.gridGame = document.querySelector("#grille_de_jeu");
    this.boxList = this.gridGame.querySelectorAll(".col.box"); // Remplir boxList avec les éléments
    this.boxList.forEach((box, index) => {
      box.addEventListener("click", () => {
        console.log("click")
        this.onBoxClick(index); // Ajoute un événement de clic pour chaque box
      });
    });
  }

  // Méthode pour initialiser le jeu
  init() {
    console.log('gamestate de la grid',this.gameState)
    this.setBushes(); // Initialise les buissons
    this.setPokemon(); // Initialise les Pokémon
    this.setEventListener();
  }

  // Méthode pour placer les buissons
  setBushes() {
    this.boxList.forEach((cell) => {
      // Initialisation des bush
      const bushImg = document.createElement("img");
      bushImg.src = "./assets/bush.webp";
      bushImg.alt = "Bush";
      bushImg.classList.add("bush");
      cell.appendChild(bushImg);
    });
  }

  // Méthode pour placer les Pokémon
  setPokemon() {
    
    this.boxList.forEach((cell, index) => {
      const pokemon = this.gameState.pokemonInGame[index];
      console.log(this.gameState)
      // Vérifie si pokemon existe avant de tenter de l'utiliser
      if (!pokemon) {
        console.error(`Le Pokémon à l'index ${index} est indéfini.`);
        return; // Passe à la cellule suivante si le Pokémon est indéfini
      }

      const { name, sprite, state } = pokemon; // Déstructuration uniquement si pokemon existe

      const pokemonImg = document.createElement("img");
      pokemonImg.classList.add("pokemon");
      pokemonImg.style.display = "none"; // Pokémon caché par défaut
      pokemonImg.alt = name;
      pokemonImg.src = sprite;

      const bush = cell.querySelector(".bush"); // Récupère le buisson de la cellule
      switch (state) {
        case "REVEALED":
          bush.style.opacity = "0"; // Cache le buisson si le Pokémon est révélé ou capturé
          pokemonImg.style.display = "block"; // Affiche l'image du Pokémon
          break;
        case "CAUGHT":
          bush.style.opacity = "0"; // Cache le buisson si le Pokémon est révélé ou capturé
          pokemonImg.style.display = "block"; // Affiche l'image du Pokémon
          break;
        case "HIDDEN":
        default:
          bush.style.opacity = "1"; // Affiche le buisson si le Pokémon est caché
          pokemonImg.style.display = "none"; // Cache l'image du Pokémon
          break;
      }

      // Ajoute l'image du Pokémon à la cellule
      cell.appendChild(pokemonImg);
    });
  }

  // Méthode appelée lors d'un clic sur une cellule
  onBoxClick(index) {
    const pokemon = this.gameState.pokemonInGame[index];
    console.log(pokemon);
    this.gameState.stats.incrementCount();
    if (pokemon.state == "HIDDEN") {
      // Si le Pokémon est caché, il devient révélé
      this.gameState.setPokemonRevealed(index);
      this.gameState.pokemonRevealed.push(pokemon); // Met à jour le tableau des Pokémon révélés
      this.setPokemon(); // Met à jour l'affichage des Pokémon
      this.checkPokemonCaught(); // Vérifie si deux Pokémon ont été révélés
    }
  }

  // Vérifie si deux Pokémon ont été révélés et les compare
  checkPokemonCaught() {
    // Si deux Pokémon ont été révélés, on vérifie s'ils sont les mêmes
    if (this.gameState.pokemonRevealed.length === 2) {
      const [pokemon1, pokemon2] = this.gameState.pokemonRevealed;

      if (pokemon1.name === pokemon2.name) {
        // Si les Pokémon sont identiques, on les marque comme capturés
        this.gameState.pokemonCaught.push(pokemon1); // Ajoute le Pokémon à la liste des capturés
        pokemon1.state = "CAUGHT"; // Marque comme capturé
        pokemon2.state = "CAUGHT"; // Marque comme capturé
        this.gameState.checkWinCondition(); //TODO condition de victoire
      } else {
        // Si les Pokémon ne correspondent pas, on les cache à nouveau
        pokemon1.state = "HIDDEN";
        pokemon2.state = "HIDDEN";
      }

      // Réinitialiser le tableau des Pokémon révélés
      this.gameState.pokemonRevealed = [];

      // Met à jour l'affichage des Pokémon
      setTimeout(() => {
        this.setPokemon(); // Met à jour l'affichage après un délai
      }, 1000);
    }
  }
}

export default GameGrid;
