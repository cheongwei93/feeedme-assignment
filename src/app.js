const fs = require("fs");
const OrderManager = require("./orderManager");
const { BotManager } = require("./botManager");
const { ORDER_TYPE } = require("./constant");
const EventEmitter = require("events");
const eventEmitter = new EventEmitter();

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
  const logger = new Logger("result.txt");
  const orderMgr = new OrderManager();
  const botMgr = new BotManager(orderMgr, logger);

  logger.log("Starting simulation...\n");

  orderMgr.addOrder(ORDER_TYPE.NORMAL);
  orderMgr.addOrder(ORDER_TYPE.VIP);
  orderMgr.addOrder(ORDER_TYPE.NORMAL);

  botMgr.addBot();
  botMgr.addBot();

  orderMgr.addOrder(ORDER_TYPE.VIP);

  setTimeout(() => botMgr.removeBot(), 4000);
}

eventEmitter.on("allOrdersComplete", () => {
  logger.log("\nSimulation finished.");
  process.exit(0);
});

runApp();
