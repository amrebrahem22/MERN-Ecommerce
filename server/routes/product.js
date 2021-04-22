const  express = require('express');
const router = express.Router();

// Middleware
const { authCheck, adminCheck } = require('../middlewares/auth');

const { create, listAll, remove, read, update, list, productsTotal, productStar } = require('../controllers/product');

router.post('/product', authCheck, adminCheck, create);
router.get('/products/total', productsTotal)
router.get('/products/:count', listAll);
router.delete('/products/:slug', authCheck, adminCheck, remove);
router.put('/product/:slug', authCheck, adminCheck, update);
router.get('/product/:slug', read);
router.post('/products', list);
router.post('/product/star/:productId', productStar);

module.exports = router;
