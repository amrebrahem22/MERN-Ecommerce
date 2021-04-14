const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const SubSchema = new mongoose.Schema({
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
    },
    parent: {
        type: ObjectId,
        ref: 'Category',
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Sub', SubSchema);