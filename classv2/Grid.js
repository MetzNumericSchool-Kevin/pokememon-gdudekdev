class GameGrid {
      constructor(gameState) {
        this.gameState = gameState.gameState; 
        this.gridgame = null;
        this.boxList = [];
        this.init();
      }
    
      init() {
        console.log("INIT");
        this.setGrid();
      }
    
      setGrid() {
        this.gridgame = document.querySelector("#grille_de_jeu");
        if (!this.gridgame) {
          console.error("Élément #grille_de_jeu introuvable !");
          return;
        }
    
        this.gridgame.innerHTML = "";
        this.setBush();
        this.setPokemon();
    
        this.boxList.forEach((cell, index) => {
          cell.addEventListener("click", () => this.handleBoxClick(index));
        });
      }
    
      setBush() {
        for (let i = 0; i < this.gameState.gameSize * 2; i++) {
          const cell = document.createElement("div");
          cell.classList.add("col", "box");
    
          const bushImg = document.createElement("img");
          bushImg.src = "./assets/bush.webp";
          bushImg.alt = "Bush";
          bushImg.classList.add("bush");
    
          cell.appendChild(bushImg);
          this.gridgame.appendChild(cell);
        }
        
        this.boxList = Array.from(this.gridgame.querySelectorAll(".col.box")); // Convertir en tableau
      }
    
      setPokemon() {
        if (!this.gameState.pokemonInGame || !Array.isArray(this.gameState.pokemonInGame)) {
          console.error("pokemonInGame n'est pas défini ou n'est pas un tableau !");
          return;
        }
    
        console.log("SET", this.boxList);
        console.log(this.gameState);
        console.log(this.gameState.pokemonInGame);
    
        this.boxList.forEach((cell, index) => {
          const pokemon = this.gameState.pokemonInGame[index];
          if (!pokemon) {
            console.warn(`Aucun Pokémon pour la case ${index}.`);
            return;
          }
    
          const { name, sprite } = pokemon;
          console.log(name, sprite);
    
          if (!name || !sprite) {
            console.warn(`Données incomplètes pour le Pokémon à l'index ${index}.`);
            return;
          }
    
          const pokemonImg = document.createElement("img");
          pokemonImg.classList.add("pokemon");
          pokemonImg.alt = name;
          pokemonImg.src = sprite;
    
          cell.appendChild(pokemonImg);
        });
      }
    
      handleBoxClick(index) {
        const cell = this.boxList[index];
        if (!cell) {
          console.error(`Aucune cellule trouvée à l'index ${index}.`);
          return;
        }
    
        console.log("Case cliquée :", cell);
      }
    }
    
    export default GameGrid;
    