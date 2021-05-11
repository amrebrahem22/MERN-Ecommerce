const  express = require('express');
const router = express.Router();

// Middleware
const { authCheck, adminCheck } = require('../middlewares/auth');

const { create, remove, list, applyCouponToUserCart } = require('../controllers/coupon');

router.post('/coupon', authCheck, adminCheck, create);
router.get('/coupons', list);
router.delete('/coupon/:couponId', authCheck, adminCheck, remove);

router.post('/user/cart/coupon', authCheck, applyCouponToUserCart);

module.exports = router;
