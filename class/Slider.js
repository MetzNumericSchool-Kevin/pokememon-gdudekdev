class Slider {
  constructor(gameState) {
    this.gameState = gameState;
    this.slider = document.querySelector("#slider");
    this.sliderValue = this.slider.querySelector("p");
  }
  init() {
    this.slider.setAttribute("min", 2);
    this.slider.setAttribute("max", gameState.pokemonEntities.length);
    this.slider.step = 1;
    this.sliderValue.innerText = gameState.gameSize;

    sliderSetEventListener();
  }
  sliderSetEventListener() {
    this.slider.addEventListener("input", () => {
      this.sliderValue.innerText = parseInt(slider.value, 10);
      gameState.gameSize = this.sliderValue;
    });
  }
}

export default Slider;
