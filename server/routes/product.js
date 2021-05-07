const  express = require('express');
const router = express.Router();

// Middleware
const { authCheck, adminCheck } = require('../middlewares/auth');

const { create, listAll, remove, read, update, list, productsTotal, productStar, listRelated, searchFilters } = require('../controllers/product');

router.post('/product', authCheck, adminCheck, create);
router.get('/products/total', productsTotal)
router.get('/products/:count', listAll);
router.delete('/products/:slug', authCheck, adminCheck, remove);
router.put('/product/:slug', authCheck, adminCheck, update);
router.get('/product/:slug', read);
router.post('/products', list);
router.put('/product/star/:productId', authCheck, productStar);
router.get('/product/related/:productId', listRelated);
router.post('/product/filters', searchFilters);

module.exports = router;
