const  express = require('express');
const router = express.Router();

// Middleware
const { authCheck, adminCheck } = require('../middlewares/auth');

const { create } = require('../controllers/product');

router.post('/product', authCheck, adminCheck, create);

module.exports = router;
