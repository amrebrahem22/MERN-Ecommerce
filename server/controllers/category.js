const Category = require('../models/category');
const slugify = require('slugify');

exports.create = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await new Category({name, slug: slugify(name)}).save();
        res.json(category)
    } catch (err) {
        console.log(err);
        res.status(400)
    }
}

exports.list = async (req, res) =>
    res.json(await Category.find({}).sort({createdAt: -1}).exec())

exports.read = async (req, res) => {
    const category = await Category.findOne({slug: req.params.slug}).exec()
    res.json(category);
}

exports.update = async (req, res) => {
    const { name } = req.body;
    try {
        const category = await Category.findOneAndUpdate({slug: req.params.slug}, { name, slug: slugify(name) }, { new: true });
        res.json(category)
    } catch(err) {
        res.status(400).send('Faild to Update');
    }
}

exports.remove = async (req, res) => {
    try {
        const category = await Category.findOneAndDelete({slug: req.params.slug});
        res.json(category);
    } catch(err) {
        res.status(400).send('Faild to Delete.')
    }
}