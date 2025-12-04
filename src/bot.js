class Bot {
  constructor(id) {
    this.id = id;
    this.status = null;
    this.current = null; // as in current order
    this.timeout = null;
  }
}
module.exports = Bot;
