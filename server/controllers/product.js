const Product = require('../models/product');
const User = require('../models/user');
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

exports.productStar = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec();
    const user = await User.findOne({ email: req.user.email }).exec();
    const { star } = req.body;

    // who is updating?
    // check if currently logged in user have already added rating to this product?
    let existingRatingObject = product.ratings.find(
        (ele) => ele.postedBy.toString() === user._id.toString()
    );

    // if user haven't left rating yet, push it
    if (existingRatingObject === undefined) {
        let ratingAdded = await Product.findByIdAndUpdate(
        product._id,
        {
            $push: { ratings: { star, postedBy: user._id } },
        },
        { new: true }
        ).exec();
        console.log("ratingAdded", ratingAdded);
        res.json(ratingAdded);
    } else {
        // if user have already left rating, update it
        const ratingUpdated = await Product.updateOne(
        {
            ratings: { $elemMatch: existingRatingObject },
        },
        { $set: { "ratings.$.star": star } },
        { new: true }
        ).exec();
        console.log("ratingUpdated", ratingUpdated);
        res.json(ratingUpdated);
    }
}

exports.listRelated = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec();

    const related = await Product.find({
        _id: { $ne: product._id },
        category: product.category
    })
    .limit(3)
    .populate('category')
    .populate('subs')
    .populate('postedBy')
    .exec();

    res.json(related);
}

const handleQuery = async (req, res, query) => {
    const products = await Product.find({ $text: { $search: query } })
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name')
    .exec();
    
    res.json(products);
}

const handlePrice = async (req, res, price) => {
    try{
        
        const products = await Product.find({
            price: {
                $gte: price[0],
                $lte: price[1]
            }
        })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec();
        
        res.json(products);
    } catch (err) {
        console.log(err);
    }
}

const handleCategory = async (req, res, category) => {
    try{
        const products = await Product.find({category})
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec();
        
        res.json(products);
    } catch (err) {
        console.log(err);
    }
}

const handleStar = (req, res, stars) => {
    Product.aggregate([
        {
            $project: {
                document: '$$ROOT',
                // title: '$title', => another way
                floorAverage: {
                    $floor: { $avg: '$ratings.star' }
                }
            }
        }, 
        { $match: { floorAverage: stars } }
    ])
    .limit(12)
    .exec((err, aggregates) => {
        if (err) console.log('AGGREGATE ERROR => ', err)
        Product.find({_id: aggregates})
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec((err, products) => {
            if (err) console.log('PRODUCT AGGREGTAE ERROR => ', err)
            res.json(products);
        });
    })
}

const handleSub = async (req, res, sub) => {
    let products = await Product.find({subs: sub._id})
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name')
    .exec();

    res.json(products)
}

const handleShipping = async (req, res, shipping) => {
    let products = await Product.find({shipping})
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name')
    .exec();

    res.json(products)
}

const handleColor = async (req, res, color) => {
    let products = await Product.find({color})
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name')
    .exec();

    res.json(products)
}

const handleBrand = async (req, res, brand) => {
    let products = await Product.find({brand})
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .populate('postedBy', '_id name')
    .exec();

    res.json(products)
}

exports.searchFilters = async (req, res) => {
    const { query, price, category, stars, sub, shipping, color, brand } = req.body;

    if(query) {
        console.log('Query', query);
        await handleQuery(req, res, query);
    }

    // we expext the price to be array like that => [min, max] => [200, 1000]
    if (price !== undefined) {
        console.log('PRICE BACKEND => ', price);
        await handlePrice(req, res, price);
    }

    if (category !== undefined) {
        console.log('CATEGORY BACKEND => ', category);
        await handleCategory(req, res, category);
    }

    if (stars !== undefined) {
        console.log('STARs BACKEND => ', stars);
        await handleStar(req, res, stars);
    }

    if (sub !== undefined) {
        console.log('SUB BACKEND => ', sub);
        await handleSub(req, res, sub);
    }
    
    if (shipping !== undefined) {
        console.log('SHIPPING BACKEND => ', shipping);
        await handleShipping(req, res, shipping);
    }

    if (color !== undefined) {
        console.log('COLOR BACKEND => ', color);
        await handleColor(req, res, color);
    }

    if (brand !== undefined) {
        console.log('brand BACKEND => ', brand);
        await handleBrand(req, res, brand);
    }
}
