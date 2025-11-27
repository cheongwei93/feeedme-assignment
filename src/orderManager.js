const { timestamp } = require("./botManager");
const { ORDER_TYPE, ORDER_STATUS } = require("./constant");
const Order = require("./order");

class OrderManager {
  constructor() {
    this.pending = [];
    this.completed = [];
    this.orderId = 1;
  }
  addOrder(type) {
    const order = new Order(this.orderId++, type);

    if (type === ORDER_TYPE.VIP) {
      const lastVip = this.pending
        .map((o) => o.orderType)
        .lastIndexOf(ORDER_TYPE.VIP);
      if (lastVip === -1) {
        this.pending.unshift(order);
      } else {
        this.pending.splice(lastVip + 1, 0, order);
      }
    } else {
      this.pending.push(order);
    }

    console.log(
      `${order.orderType} Order ${order.id} is created at ${timestamp()}`
    );
    return order;
  }

  markComplete(order) {
    order.status = ORDER_STATUS.COMPLETE;
    this.completed.push(order);
  }
}

module.exports = OrderManager;
