import Pokemon from "./Pokemon.js";

class Save {
  constructor() {
    this.data = [];
    this.getData();
  }
  
  async getData() {
    const savedData = localStorage.getItem("pokemon_save");

    if (savedData) {
      this.data = JSON.parse(savedData);
    } else {
      await this.fetchData();
    }
  }
  async fetchData() {
    try {
      const response = await fetch("http://localhost:5500/data/pokemon.json");
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      const data = await response.json();
      this.data = data.map(
        (pokemon) => new Pokemon(pokemon.name, pokemon.sprite)
      );
      this.saveData();
    } catch (error) {
      console.error("Erreur lors de la récupération des Pokémon :", error);
    }
  }
  saveData() {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("pokemon_save", JSON.stringify(this.data));
    }
  }
  clearData() {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("pokemon_save");
      this.data = [];
    }
  }
}

export default Save;
