const Bot = require("./bot");
const { ORDER_STATUS, BOT_STATUS } = require("./constant");

class BotManager {
  constructor(orderManager, logger, eventEmitter) {
    this.bots = [];
    this.orderManager = orderManager;
    this.logger = logger; // prints to result.txt
    this.eventEmitter = eventEmitter;
  }

  addBot() {
    const bot = new Bot(this.bots.length + 1);
    bot.status = BOT_STATUS.ACTIVE;
    this.bots.push(bot);
    this.logger.log(
      `${timestamp()} Bot #${bot.id} created - Status: ${bot.status}`
    );
    this.assignOrders();
  }

  removeBot() {
    if (this.bots.length === 0) return null;

    const bot = this.bots.pop();

    if (bot.current) {
      clearTimeout(bot.timeout);
      // Return order to queue
      bot.current.status = ORDER_STATUS.PENDING;
      this.orderManager.pending.unshift(bot.current);
      bot.current = null;
    }

    if (bot.status === BOT_STATUS.IDLE) {
      this.logger.log(
        `${timestamp()} Bot #${bot.id} destroyed while ${bot.status}`
      );
    }
    this.assignOrders();
    return bot;
  }

  assignOrders() {
    for (const bot of this.bots) {
      if (!bot.current && this.orderManager.pending.length > 0) {
        const order = this.orderManager.pending.shift();
        this.process(bot, order);
      } else if (!bot.current && this.orderManager.pending.length === 0) {
        if (bot.status !== BOT_STATUS.IDLE) {
          bot.status = BOT_STATUS.IDLE;
          this.logger.log(
            `${timestamp()} Bot #${bot.id} is now ${
              bot.status
            } - No pending orders`
          );
        }
      }
    }
    if (
      this.orderManager.pending.length === 0 &&
      this.bots.every((b) => !b.current)
    ) {
      this.eventEmitter.emit("allOrdersComplete");
    }
  }

  process(bot, order) {
    bot.current = order;
    order.status = ORDER_STATUS.PROCESSING;
    const processTimeInSeconds = 10;

    this.logger.log(
      `${timestamp()} Bot #${bot.id} picked up ${order.orderType} Order #${
        order.id
      } - Status: ${order.status}`
    );

    bot.timeout = setTimeout(() => {
      this.orderManager.markComplete(order);

      this.logger.log(
        `${timestamp()} Bot #${bot.id} completed ${order.orderType} Order #${
          order.id
        } - Status: ${order.status} (Processing time: ${processTimeInSeconds}s)`
      );

      bot.current = null;
      bot.timeout = null;
      this.assignOrders();
    }, processTimeInSeconds * 1000);
  }
}

function timestamp() {
  return `[${new Date().toLocaleTimeString("en-US", { hour12: false })}]`;
}

module.exports = { BotManager, timestamp };
