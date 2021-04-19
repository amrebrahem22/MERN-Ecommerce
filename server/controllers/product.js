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

exports.listAll = async (req, res) => {
    let products = await Product.find().limit(parseInt(req.params.count)).populate('category').populate('subs').sort([['createdAt', 'desc']]).exec();
    res.json(products);
} 

exports.read = async (req, res) => {
    let product = await Product.findOne({slug: req.params.slug}).populate('category').populate('subs').exec();
    res.json(product);
}

exports.remove = async (req, res) => {
    try {
        let deleted = await Product.findOneAndRemove({slug: req.params.slug}).exec();
        res.json(deleted) 
    } catch (err) {
        console.log('REMOVE PRODUCT FAILD BACKEND =>', err);
        res.status(400).send('Product Delete Faild');
    }
}