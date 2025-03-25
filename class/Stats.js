class GameStats {
  constructor() {
    this.count = 0;
    this.countRecord = null;
    this.loadRecord(); // Charger l'enregistrement dès l'instantiation
  }

  loadRecord() {
    const savedRecord = localStorage.getItem("pokemon_save_record");
    this.countRecord = savedRecord ? JSON.parse(savedRecord) : null;
  }

  saveRecord() {
    localStorage.setItem(
      "pokemon_save_record",
      JSON.stringify(this.countRecord)
    );
  }
  getCount() {
    return this.count;
  }

  setCount(count) {
    if (count >= 0) this.count = count;
  }

  getCountRecord() {
    return this.countRecord;
  }

  updateCountRecord() {
    this.countRecord = this.countRecord
      ? Math.min(this.count, this.countRecord)
      : this.count;
      this.saveRecord();
  }

  incrementCount() {
    this.count++;
  }
}

export default GameStats;
