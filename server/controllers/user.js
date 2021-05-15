const Product = require('../models/product');
const User = require('../models/user');
const Cart = require('../models/cart');
const Order = require('../models/order');
const uniqueid = require("uniqueid");

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

exports.createOrder = async (req, res) => {

    const { paymentIntent } = req.body.stripeResponse

    // get the user
    const user = await User.findOne({email: req.user.email}).exec();

    // get the cart
    let {products} = await Cart.findOne({orderedBy: user._id}).exec();
    console.log('products ',products)

    // Save the order 
    const newOrder = await new Order({
        products,
        paymentIntent,
        orderdBy: user._id
    }).save();

    console.log('NEW ORDER SAVED => ', newOrder)

    // perform bulk action to update multiple products (sold, quantity)
    let bulkOptions = products.map(item => {
        return {
            updateOne: {
                filter: { _id: item.product._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } }
            }
        }
    })

    let updated = await Product.bulkWrite(bulkOptions, {});
    console.log('BULK ACTION OCCUR => ', updated)

    res.json({ok: true})  
}

exports.userOrders = async (req, res) => {
    // get the user
    const user = await User.findOne({email: req.user.email}).exec();

    // get the order
    const order = await Order.find({orderdBy: user._id}).populate('products.product').exec()

    res.json(order);
}

// addToWishlist wishlist removeFromWishlist
exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;

  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $addToSet: { wishlist: productId } }
  ).exec();

  res.json({ ok: true });
};

exports.wishlist = async (req, res) => {
  const list = await User.findOne({ email: req.user.email })
    .select("wishlist")
    .populate("wishlist")
    .exec();

  res.json(list);
};

exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $pull: { wishlist: productId } }
  ).exec();

  res.json({ ok: true });
};

exports.createCashOrder = async (req, res) => {
  const { COD, couponApplied } = req.body;
  // if COD is true, create order with status of Cash On Delivery

  if (!COD) return res.status(400).send("Create cash order failed");

  const user = await User.findOne({ email: req.user.email }).exec();

  let userCart = await Cart.findOne({ orderedBy: user._id }).exec();

  let finalAmount = 0;

  if (couponApplied && userCart.totalAfterDiscount) {
    finalAmount = userCart.totalAfterDiscount * 100;
  } else {
    finalAmount = userCart.cartTotal * 100;
  }

  let newOrder = await new Order({
    products: userCart.products,
    paymentIntent: {
      id: uniqueid(),
      amount: finalAmount,
      currency: "usd",
      status: "Cash On Delivery",
      created: Date.now(),
      payment_method_types: ["cash"],
    },
    orderdBy: user._id,
    orderStatus: "Cash On Delivery",
  }).save();

  // decrement quantity, increment sold
  let bulkOption = userCart.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id }, // IMPORTANT item.product
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  let updated = await Product.bulkWrite(bulkOption, {});
  console.log("PRODUCT QUANTITY-- AND SOLD++", updated);

  console.log("NEW ORDER SAVED", newOrder);
  res.json({ ok: true });
};
