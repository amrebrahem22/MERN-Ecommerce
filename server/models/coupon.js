const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const couponSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        uppercase: true,
        unique: true,
        maxlength: [12, ' Too Long'],
        minlength: [6, ' Too Short'],
    },
    expiry: {
        type: Date,
        required: true
    },
    discount: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);