class Bot {
  constructor(id) {
    this.id = id;
    this.working = false;
    this.current = null;
    this.timeout = null;
  }
}
module.exports = Bot;
