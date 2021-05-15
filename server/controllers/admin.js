const Order = require('../models/order');

exports.orders = async (req, res) => {

    // get the orders
    const orders = await Order.find({}).sort('-createdAt').populate('products.product').exec()

    res.json(orders);
}

exports.orderStatus = async (req, res) => {
    const { orderId, orderStatus } = req.body;

    let updated = await Order.findByIdAndUpdate(orderId, { orderStatus }, { new: true }).exec();

    res.json(updated)
}