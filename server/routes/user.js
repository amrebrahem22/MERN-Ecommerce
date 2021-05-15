const express = require('express');
const router = express.Router();

const { authCheck } = require('../middlewares/auth');
const { userCart, getUserCart, emptyCart, saveAddress, createOrder, userOrders, addToWishlist, wishlist, removeFromWishlist, createCashOrder } = require('../controllers/user');

router.post('/user/cart', authCheck, userCart)
router.get('/user/cart', authCheck, getUserCart)
router.delete('/user/cart', authCheck, emptyCart)
router.post('/user/address', authCheck, saveAddress)

// Order create
router.post('/user/order', authCheck, createOrder)
router.get('/user/orders', authCheck, userOrders)
router.post("/user/cash-order", authCheck, createCashOrder); // cod

router.post("/user/wishlist", authCheck, addToWishlist);
router.get("/user/wishlist", authCheck, wishlist);
router.put("/user/wishlist/:productId", authCheck, removeFromWishlist);

module.exports = router