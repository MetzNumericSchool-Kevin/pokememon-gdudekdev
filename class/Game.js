import GameGrid from "./Grid.js";
import GameSave from "./Save.js";
import GameStats from "./Stats.js";
import Slider from "./Slider.js";
import Sidebar from "./SideBar.js";
import GameState from "./State.js";

class Game {
  constructor() {
    // Initialisation des composants du jeu
    this.gameState = new GameState(); // Cette classe gère l'état général du jeu (Pokémons, état)
    this.grid = new GameGrid(this.gameState); // La grille prend l'état du jeu pour le manipuler
    this.stats = new GameStats(); // Gère les statistiques
    this.slider = new Slider(this.gameState); // Gère la logique du slider (peut-être pour ajuster la difficulté)
    this.sidebar = new Sidebar(this.gameState); // La sidebar prend l'état du jeu pour afficher les Pokémon capturés
    this.save = new GameSave(); // Sauvegarde et chargement des états de jeu

    // Démarrer le jeu
    this.startGame();

    const replayButton = document.getElementById("rejouer");
    replayButton.addEventListener("click", () => this.restartGame());
  }

  startGame() {
    console.log("Jeu lancé");
    // Charger l'état de la sauvegarde s'il y en a une
    if (this.save.gameState) {
      console.log("Chargement de la sauvegarde...");
      this.gameState.loadSave();
      this.grid.setPokemon(); // Met à jour la grille en fonction de l'état chargé
      this.stats.updateCountRecord(); // Met à jour les statistiques (score, etc.)
    } else {
      console.log("Aucune sauvegarde trouvée, démarrage d'un nouveau jeu.");
      this.gameState.init(); // Si pas de sauvegarde, initialise un nouveau jeu
      this.grid.init(); // Initialise la grille (les buissons, les Pokémon)
      this.stats.setCount(0); // Réinitialise le compteur de statistiques
    }

    // Ajouter un écouteur d'événements pour sauvegarder l'état du jeu avant que la page ne soit fermée
    window.addEventListener("beforeunload", () => {
      this.save.saveGameState(this.gameState); // Sauvegarde l'état actuel du jeu dans le localStorage
    });

    // Initialiser la sidebar avec les Pokémon capturés
    this.sidebar.init(this.gameState);
  }
  restartGame() {
    // Réinitialiser l'état du jeu
    console.log("Redémarrage du jeu...");
    this.gameState = new GameState(); // Crée un nouvel état du jeu (réinitialise les Pokémon, les statistiques, etc.)
    this.grid = new GameGrid(this.gameState); // Réinitialise la grille avec le nouvel état
    this.stats = new GameStats(); // Réinitialise les statistiques
    this.sidebar = new Sidebar(this.gameState); // Réinitialise la sidebar
    this.save.clear();
    // Relance la partie avec un nouvel état
    this.startGame(); // Démarre un nouveau jeu
  }
}

 new Game();

