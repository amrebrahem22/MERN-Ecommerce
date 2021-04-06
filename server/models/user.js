const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const userScheam = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        index: true
    },
    rule: {
        type: String,
        default: 'subscriber'
    },
    cart: {
        type: Array,
        default: []
    },
    // wishlist: [{ type: ObjectId, ref: 'product' }]
}, {timestamp: true});

module.exports = mongoose.model('User', userSchema);