const  express = require('express');
const router = express.Router();

// Middleware
const { authCheck, adminCheck } = require('../middlewares/auth');

const { create, update, read, remove, list, getSubs, getCategoryProducts } = require('../controllers/category.js');

router.post('/category', authCheck, adminCheck, create);
router.get('/categories', list);
router.get('/category/:slug', read);
router.get('/categories/:slug', getCategoryProducts);
router.put('/category/:slug', authCheck, adminCheck, update);
router.delete('/category/:slug', authCheck, adminCheck, remove);
router.get('/category/subs/:_id', getSubs);

module.exports = router;
