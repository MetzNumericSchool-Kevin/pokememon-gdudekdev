import Save from "./Save.js";
import { shuffleArray } from "../utils/utils.js";

class GameState {
  constructor(gameSize = 6) {
    this.gameState = {
      gameSize: gameSize,
      pokemonEntities: new Save(),
      pokemonInGame: [],
      pokemonRevealed: [],
      pokemonCaught: [],
    };

    this.init(); 
  }

  async init() {
    await this.gameState.pokemonEntities.getData();

    const allPokemon = this.gameState.pokemonEntities.data;
    if (!allPokemon || allPokemon.length === 0) {
      console.error("Aucun Pokémon disponible !");
      return;
    }
    const gameSet = new Set();
    while (gameSet.size < this.gameState.gameSize) {
      const randomIndex = Math.floor(Math.random() * allPokemon.length);
      gameSet.add(allPokemon[randomIndex]);
    }
    this.gameState.pokemonInGame = shuffleArray([...gameSet, ...gameSet]);
  }
  setPokemonHidden(index) {
    if (this.pokemonInGame[index]) {
      this.pokemonInGame[index].state = "HIDDEN"; 
    }
  }
  setPokemonRevealed(index) {
    if (this.pokemonInGame[index]) {
      this.pokemonInGame[index].state = "REVEALED"; 
    }
  }
  setPokemonCaught(index) {
    if (this.pokemonInGame[index]) {
      this.pokemonInGame[index].state = "CAUGHT"; 
    }
  }
}
export default GameState;
