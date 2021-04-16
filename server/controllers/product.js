const Product = require('../models/product');
const slugify = require('slugify');

exports.create = async (req, res) => {
    try {
        console.log(req.body);
        req.body.slug = slugify(req.body.title);
        const product = await new Product(req.body).save();
        res.json(product); 
    } catch (err) {
        console.log('PRODUCT CREATE ERROR => ', err);
        res.status(400).json({err: err.message});
    }
}

exports.read = async (req, res) => {
    let products = await Product.find({});
    res.json(products);
} 