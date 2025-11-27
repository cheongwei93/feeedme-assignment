const { ORDER_STATUS } = require("./constant");

class Order {
  constructor(id, orderType) {
    this.id = id;
    this.orderType = orderType;
    this.status = ORDER_STATUS.PENDING;
    this.createdAt = new Date();
  }
}

module.exports = Order;
