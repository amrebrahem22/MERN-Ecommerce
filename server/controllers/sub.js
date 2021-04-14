const Sub = require('../models/sub');
const slugify = require('slugify');

exports.create = async (req, res) => {
    try {
        const { name } = req.body;
        const sub = await new Sub({name, slug: slugify(name)}).save();
        res.json(sub)
    } catch (err) {
        console.log(err);
        res.status(400).send('Faild to Create')
    }
}

exports.list = async (req, res) =>
    res.json(await Sub.find({}).sort({createdAt:-1}).exec())

exports.read = async (req, res) => {
    const sub = await Sub.findOne({slug: req.params.slug}).exec()
    res.json(sub);
}

exports.update = async (req, res) => {
    const { name } = req.body;
    try {
        const sub = await Sub.findOneAndUpdate({slug: req.params.slug}, { name, slug: slugify(name) }, { new: true });
        res.json(sub)
    } catch(err) {
        res.status(400).send('Faild to Update');
    }
}

exports.remove = async (req, res) => {
    try {
        const sub = await Sub.findOneAndDelete({slug: req.params.slug});
        res.json(sub);
    } catch(err) {
        res.status(400).send('Faild to Delete.')
    }
}