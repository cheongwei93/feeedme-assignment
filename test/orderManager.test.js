const { describe } = require("node:test");
const OrderManager = require("../src/orderManager");
const { ORDER_TYPE } = require("../src/constant");

class FakeLogger {
  constructor() {
    this.logs = [];
  }
  log(msg) {
    this.logs.push(msg);
  }
}

describe("Order Manager", () => {
  test("Make sure orderIds are unique", () => {
    const logger = new FakeLogger();
    const orderManager = new OrderManager(logger);

    const order1 = orderManager.addOrder(ORDER_TYPE.NORMAL);
    const order2 = orderManager.addOrder(ORDER_TYPE.VIP);
    const order3 = orderManager.addOrder(ORDER_TYPE.NORMAL);

    const ids = [order1.id, order2.id, order3.id];
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("Normal order should be placed at the end of the pending queue", () => {
    const logger = new FakeLogger();
    const orderManager = new OrderManager(logger);

    orderManager.addOrder(ORDER_TYPE.NORMAL); // order #1
    orderManager.addOrder(ORDER_TYPE.NORMAL); // order #2

    const pendingOrderIds = orderManager.pending.map((order) => order.id);
    expect(pendingOrderIds).toEqual([1001, 1002]);
  });

  test("VIP orders should place before NORMAL but after existing VIPs", () => {
    const logger = new FakeLogger();
    const orderManager = new OrderManager(logger);

    const order1 = orderManager.addOrder(ORDER_TYPE.NORMAL);
    const order2 = orderManager.addOrder(ORDER_TYPE.VIP);
    const order3 = orderManager.addOrder(ORDER_TYPE.NORMAL);
    const order4 = orderManager.addOrder(ORDER_TYPE.VIP);

    const queue = orderManager.pending.map(
      (order) => `${order.orderType}-${order.id}`
    );

    expect(queue).toEqual([
      "VIP-1002",
      "VIP-1004",
      "Normal-1001",
      "Normal-1003",
    ]);
  });
});
