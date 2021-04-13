const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: "Name is Required.",
        minlength: [2, 'Name is too Short.'],
        maxlength: [32, 'Name is too Long.']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true
    }
}, {timestamp: true});

module.exports = mongoose.model('Category', categorySchema);