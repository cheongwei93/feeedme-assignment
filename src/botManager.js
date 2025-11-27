const Bot = require("./bot");
const { ORDER_STATUS } = require("./constant");
const EventEmitter = require("events");
const eventEmitter = new EventEmitter();

class BotManager {
  constructor(orderManager, logger) {
    this.bots = [];
    this.orderManager = orderManager;
    this.logger = logger; // prints to result.txt
  }

  addBot() {
    const bot = new Bot(this.bots.length + 1);
    this.bots.push(bot);
    this.assignOrders();
  }

  removeBot() {
    if (this.bots.length === 0) return null;

    const bot = this.bots.pop();

    if (bot.working && bot.current) {
      clearTimeout(bot.timeout);
      // Return order to queue
      bot.current.status = "PENDING";
      this.orderManager.pending.unshift(bot.current);
    }
    return bot;
  }

  assignOrders() {
    for (const bot of this.bots) {
      if (!bot.working && this.orderManager.pending.length > 0) {
        const order = this.orderManager.pending.shift();
        this.process(bot, order);
      }
    }
    if (
      this.orderManager.pending.length === 0 &&
      this.bots.every((b) => !b.working)
    ) {
      eventEmitter.emit("allOrdersComplete");
    }
  }

  process(bot, order) {
    bot.working = true;
    bot.current = order;
    order.status = ORDER_STATUS.IN_PROGRESS;

    this.logger.log(
      `Bot ${bot.id} started ${order.orderType} Order ${
        order.id
      } at ${timestamp()}`
    );

    bot.timeout = setTimeout(() => {
      bot.working = false;
      this.orderManager.markComplete(order);

      this.logger.log(
        `${order.orderType} Order ${order.id} completed at ${timestamp()}`
      );

      bot.current = null;
      bot.timeout = null;
      this.assignOrders();
    }, 10000);
  }
}

function timestamp() {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

module.exports = { BotManager, timestamp };
