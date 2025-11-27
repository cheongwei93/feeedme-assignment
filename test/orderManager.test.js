const { describe } = require("node:test");
const OrderManager = require("../src/orderManager");
const { ORDER_TYPE } = require("../src/constant");

describe("Order Manager", () => {
  test("Make sure orderIds are unique", () => {
    const orderManager = new OrderManager();

    const order1 = orderManager.addOrder(ORDER_TYPE.NORMAL);
    const order2 = orderManager.addOrder(ORDER_TYPE.VIP);
    const order3 = orderManager.addOrder(ORDER_TYPE.NORMAL);

    const ids = [order1.id, order2.id, order3.id];
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("Normal order should be placed at the end of the pending queue", () => {
    const orderManager = new OrderManager();
    orderManager.addOrder(ORDER_TYPE.NORMAL); // order #1
    orderManager.addOrder(ORDER_TYPE.NORMAL); // order #2

    const pendingOrderIds = orderManager.pending.map((order) => order.id);
    expect(pendingOrderIds).toEqual([1, 2]);
  });

  test("VIP orders should place before NORMAL but after existing VIPs", () => {
    const orderManager = new OrderManager();
    const order1 = orderManager.addOrder(ORDER_TYPE.NORMAL);
    const order2 = orderManager.addOrder(ORDER_TYPE.VIP);
    const order3 = orderManager.addOrder(ORDER_TYPE.NORMAL);
    const order4 = orderManager.addOrder(ORDER_TYPE.VIP);

    const queue = orderManager.pending.map(
      (order) => `${order.orderType}-${order.id}`
    );

    expect(queue).toEqual(["VIP-2", "VIP-4", "NORMAL-1", "NORMAL-3"]);
  });
});
