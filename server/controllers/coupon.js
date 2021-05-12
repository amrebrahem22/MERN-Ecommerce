const Coupon = require('../models/coupon');
const User = require('../models/user');
const Cart = require('../models/cart');

exports.create = async (req, res) => {
    try {
        const { name, expiry, discount } = req.body.coupon;
        res.json(await new Coupon({name, expiry, discount}).save())
    } catch (error) {
        console.log(error)
    }
}
exports.list = async (req, res) => {
    try {
        res.json(await Coupon.find().sort({createdAt: -1}).exec())
    } catch (error) {
        console.log(error)
    }
}
exports.remove = async (req, res) => {
    try {
        res.json(await Coupon.findByIdAndDelete(req.params.couponId).exec())
    } catch (error) {
        console.log(error)
    }
}

exports.applyCouponToUserCart = async (req, res) => {
    const { coupon } = req.body;

    // get coupon and check if valid
    const validCoupon = await Coupon.findOne({name: coupon}).exec()

    if (validCoupon === null) {
        res.json({
            err: 'Invalid Coupon'
        })
    }

    // get the user and the cart
    const user = await User.findOne({email: req.user.email}).exec()

    let { products, cartTotal } = await Cart.findOne({orderedBy: user._id}).populate('products.product', '_id total price').exec()

    // Calculate the total after discount, and return two digits
    let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2) // will be like => 99.99

    console.log('totalAfterDiscount, ', totalAfterDiscount)
    console.log('cartTotal, ', cartTotal)
    // Update the cart totalAfterDiscount
    Cart.findOneAndUpdate({orderedBy: user._id}, {totalAfterDiscount}, {new: true}).exec()

    // return the discount price
    res.json(totalAfterDiscount)
}