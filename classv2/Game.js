import GameGrid from "./Grid.js";
import GameState from "./State.js";

class Game {
  constructor() {
    this.gameState = new GameState();
    this.grid = new GameGrid(this.gameState);
  }
}

const game = new Game();
