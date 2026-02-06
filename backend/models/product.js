const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        default: ''
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discountedPrice: {
        type: Number,
        min: 0
    },
    category: {
        type: String,
        required: true,
        default: 'Car'
    },
    km: {
        type: String,
        default: ''
    },
    fuel: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        default: 0
    },
    soldCount: {
        type: Number,
        default: 0
    },
    ratings: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            rating: { type: Number, min: 1, max: 5 },
            comment: String
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
