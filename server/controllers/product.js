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

exports.update = async (req, res) => {
    try {
        if (req.body.title) req.body.slug = slugify(req.body.title);
        const product = await Product.findOneAndUpdate({slug: req.params.slug}, req.body, {new: true}).exec();
        res.json(product); 
    } catch (err) {
        console.log('PRODUCT UPDATE ERROR => ', err);
        res.status(400).json({err: err.message});
    }
}

exports.list = async (req, res) => {
    const {sort, order, page} = req.body
    const currentPage = page || 1;
    const perPage = 3;

    try {
        let products = await Product.find().skip((currentPage - 1) * perPage).limit(perPage).populate('category').populate('subs').sort([[sort, order]]).exec();
        res.json(products);
    } catch(err) {
        console.log(err)
    }
} 

exports.productsTotal = async (req, res) => {
    let total = await Product.find({}).estimatedDocumentCount().exec();
    res.json(total)
}