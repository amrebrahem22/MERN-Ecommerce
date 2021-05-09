const Product = require('../models/product');
const User = require('../models/user');
const Cart = require('../models/cart');

exports.userCart = async (req, res) => {
    // get the cart from the request
    const { cart } = req.body

    let products = [];

    // get the user
    const user = await User.findOne({email: req.user.email}).exec();

    // check if the user has cart
    let cartExistByTheUser = await Cart.findOne({orderedBy: user._id}).exec();

    // if exist remove it
    if (cartExistByTheUser) {
        cartExistByTheUser.remove()
        console.log('Cart Removed');
    }

    // loop through each product in the cart to create our new cart
    for(let i = 0; i < cart.length; i++) {
        let object = {};

        object.product = cart[i]._id
        object.count = cart[i].count
        object.color = cart[i].color

        // get the price from the backend because if we get it from the frontend 
        // the user can change the price from the localStorage, so that's will be safe
        let { price } = await Product.findById(cart[i]._id).select('price').exec()

        object.price = price;

        // then push this object to the products array
        products.push(object);
    }

    let cartTotal = 0;
    // loop through each product to get the total
    for(let i = 0; i < products.length; i++) {
        cartTotal = cartTotal + products[i].price * products[i].count
    }

    // create a new cart and return ok to the response
    let newCart = await new Cart({ products, cartTotal, orderedBy: user._id }).save();

    console.log('New Cart has Created => ', newCart);
    res.json({ok: true})
}

exports.getUserCart = async (req, res) => {

    // get the user
    const user = await User.findOne({email: req.user.email}).exec();

    // get the cart
    let cart = await Cart.findOne({orderedBy: user._id}).populate('products.product', "_id title price totalAfterDiscount").exec();
    const { products, cartTotal, totalAfterDiscount } = cart;
    res.json({products, cartTotal, totalAfterDiscount}) // get access like that => res.data.products
}

exports.emptyCart = async (req, res) => {

    // get the user
    const user = await User.findOne({email: req.user.email}).exec();

    // get the cart
    let cart = await Cart.findOneAndRemove({orderedBy: user._id}).exec();
    res.json(cart) 
}

exports.saveAddress = async (req, res) => {

    // get the user
    const user = await User.findOneAndUpdate({email: req.user.email}, { address: req.body.address }).exec();
    
    res.json({ok: true}) 
}