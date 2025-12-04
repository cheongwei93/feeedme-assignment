const OrderManager = require("../src/orderManager");
const { BotManager } = require("../src/botManager");
const { describe } = require("node:test");
const { ORDER_TYPE, ORDER_STATUS } = require("../src/constant");
const EventEmitter = require("events");

jest.useFakeTimers();

class FakeLogger {
  constructor() {
    this.logs = [];
  }
  log(msg) {
    this.logs.push(msg);
  }
}

describe("BotManager", () => {
  const eventEmitter = new EventEmitter();
  test("Bot process an order and moves it to COMPLETE after 10 seconds", () => {
    const logger = new FakeLogger();
    const orderManager = new OrderManager(logger);
    const botManager = new BotManager(orderManager, logger, eventEmitter);

    orderManager.addOrder(ORDER_TYPE.NORMAL); // order #1
    botManager.addBot();

    jest.advanceTimersByTime(10000);

    expect(orderManager.completed.length).toBe(1);
    expect(orderManager.completed[0].id).toBe(1001);
  });

  test("Bot becomes idle after completing it no more orders", () => {
    const logger = new FakeLogger();
    const orderManager = new OrderManager(logger);
    const botManager = new BotManager(orderManager, logger, eventEmitter);

    orderManager.addOrder(ORDER_TYPE.NORMAL);
    botManager.addBot();

    jest.advanceTimersByTime(10000);

    const bot = botManager.bots[0];

    expect(bot.timeout).toBe(null);
    expect(bot.current).toBe(null);
  });

  test("Removing a bot returns its in-progress order back to pending", () => {
    const logger = new FakeLogger();
    const orderManager = new OrderManager(logger);
    const botManager = new BotManager(orderManager, logger, eventEmitter);

    orderManager.addOrder(ORDER_TYPE.NORMAL);

    botManager.addBot();

    botManager.removeBot();

    expect(orderManager.pending.length).toBe(1);
    expect(orderManager.pending[0].id).toBe(1001);
  });

  test("Bot pick next pending order automatically", () => {
    const logger = new FakeLogger();
    const orderManager = new OrderManager(logger);
    const botManager = new BotManager(orderManager, logger, eventEmitter);

    orderManager.addOrder(ORDER_TYPE.NORMAL);
    orderManager.addOrder(ORDER_TYPE.NORMAL);

    botManager.addBot();

    jest.advanceTimersByTime(10000); // Finish #1
    jest.advanceTimersByTime(10000); // Finish #2

    expect(orderManager.completed.length).toBe(2);
  });
});
