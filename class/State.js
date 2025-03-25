import { shuffleArray } from "../utils/utils.js";
import Pokemon from "./Pokemon.js";
import GameSave from "./Save.js";
import GameStats from "./Stats.js";

class GameState {
  constructor(gameSize = 6) {
    this.gameSize = gameSize;
    this.pokemonEntities = [];
    this.pokemonInGame = [];
    this.pokemonRevealed = [];
    this.pokemonCaught = [];

    this.save = new GameSave(); // Chargement de l'état du jeu
    this.stats = new GameStats(); // Chargement des statistiques
    // Charger l'état du jeu à partir du localStorage si nécessaire
    this.loadSave();
  }

  loadSave() {
    if (this.save.gameState) {
      const { gameSize, pokemonInGame, pokemonCaught, pokemonRevealed } = this.save.gameState;
      this.gameSize = gameSize || this.gameSize;
      this.pokemonInGame = pokemonInGame || [];
      this.pokemonCaught = pokemonCaught || [];
      this.pokemonRevealed = pokemonRevealed || [];
    }else{
      this.init();
    }
  }

  async init() {
    await this.setPokemonEntities()
    .then(this.setPokemonInGame());
    console.log(this.pokemonInGame);
  }

  setPokemonRevealed(index) {
    if (this.pokemonInGame[index]) {
      this.pokemonInGame[index].state = "REVEALED"; // Changer l'état du Pokémon en "REVEALED"
    }
  }

  async setPokemonEntities() {
    try {
      const response = await fetch("http://localhost:5500/data/pokemon.json");
      const data = await response.json();

      // Créer les objets Pokémon à partir des données JSON
      this.pokemonEntities = data.map(
        (pokemon) => new Pokemon(pokemon.name, pokemon.sprite)
      );

      console.log("Pokémons chargés avec succès :", this.pokemonEntities);
    } catch (error) {
      console.error("Erreur lors de la récupération des Pokémon :", error);
    }
  }

  setPokemonInGame() {
    const gameSet = new Set();
  
    // Ajouter des Pokémon aléatoirement à partir de pokemonEntities
    while (gameSet.size < this.gameSize) {
      const randomIndex = Math.floor(Math.random() * this.pokemonEntities.length);
      gameSet.add(this.pokemonEntities[randomIndex]);  // Ajoute un Pokémon unique au Set
    }
  
    // Mélange les Pokémon pour le jeu
    this.pokemonInGame = shuffleArray([...gameSet, ...gameSet]);  // Crée un jeu de mémoire avec des doublons
  
    // Vérifie que pokemonInGame est correctement peuplé
    console.log("pokemonInGame après initialisation:", this.pokemonInGame);
  }
  

  checkWinCondition() {
    // Vérification de la condition de victoire
    if (this.pokemonCaught.length === this.gameSize) {
      this.stats.updateCountRecord();  // Met à jour le record si gagné
      return true;  // Condition de victoire
    }
    return false;  // Pas encore gagné
  }
}

export default GameState;
