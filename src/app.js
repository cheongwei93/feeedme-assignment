const fs = require("fs");
const OrderManager = require("./orderManager");
const { BotManager, timestamp } = require("./botManager");
const { ORDER_TYPE } = require("./constant");
const EventEmitter = require("events");

class Logger {
  constructor(file) {
    this.file = file;
    fs.writeFileSync(file, ""); // clear
  }

  log(msg) {
    fs.appendFileSync(this.file, msg + "\n");
    console.log(msg);
  }
}

async function runApp() {
  const eventEmitter = new EventEmitter();
  const logger = new Logger("result.txt");
  const orderMgr = new OrderManager(logger);
  const botMgr = new BotManager(orderMgr, logger, eventEmitter);

  logger.log("McDonald's Order Management System - Simulation Results\n");
  logger.log(
    `${timestamp()} System initialized with ${botMgr.bots.length} bots`
  );

  orderMgr.addOrder(ORDER_TYPE.NORMAL);
  orderMgr.addOrder(ORDER_TYPE.VIP);
  orderMgr.addOrder(ORDER_TYPE.NORMAL);

  botMgr.addBot();
  botMgr.addBot();

  setTimeout(() => {
    orderMgr.addOrder(ORDER_TYPE.VIP);
    botMgr.assignOrders();
  }, 10 * 1000);

  eventEmitter.on("allOrdersComplete", () => {
    if (botMgr.bots.length > 1) {
      botMgr.removeBot();
    }
    // report status
    const totalOrdersProcessed = orderMgr.completed.concat(orderMgr.pending);
    const vipOrders = totalOrdersProcessed.filter(
      (order) => order.orderType === ORDER_TYPE.VIP
    );
    const normalOrders = totalOrdersProcessed.filter(
      (order) => order.orderType === ORDER_TYPE.NORMAL
    );
    const completedOrders = orderMgr.completed.length;
    const activeBots = botMgr.bots.length;
    const pendingOrders = orderMgr.pending.length;

    logger.log("\nFinal Status:");
    logger.log(
      `- Total Orders Processed: ${totalOrdersProcessed.length} (${vipOrders.length} VIP, ${normalOrders.length} Normal)`
    );
    logger.log(`- Orders Completed: ${completedOrders}`);
    logger.log(`- Active Bots: ${activeBots}`);
    logger.log(`- Pending Orders: ${pendingOrders}`);
    process.exit(0);
  });
}

runApp();
