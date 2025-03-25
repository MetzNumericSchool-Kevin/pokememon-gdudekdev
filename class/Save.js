class GameSave {
  constructor() {
    this.gameState = null;
    this.loadGameState(); // Charger l'état du jeu dès l'instantiation
  }

  saveGameState(gameState) {
    localStorage.setItem("pokemon_save", JSON.stringify(gameState));
  }

  loadGameState() {
    const savedState = localStorage.getItem("pokemon_save");
    this.gameState = savedState ? JSON.parse(savedState) : null;
  }
  clear() {
    localStorage.removeItem("pokemon_save");
    this.gameState = null;
  }
}
export default GameSave;
