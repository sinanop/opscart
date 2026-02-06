const Wishlist = require('../models/wishlist');


exports.getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ userId: req.user.id }).populate('products');
        if (!wishlist) {
            return res.json({ products: [] });
        }
        res.json(wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        let wishlist = await Wishlist.findOne({ userId: req.user.id });

        if (!wishlist) {
            wishlist = new Wishlist({ userId: req.user.id, products: [] });
        }

        const productExists = wishlist.products.some(p => p.toString() === productId);
        if (!productExists) {
            wishlist.products.push(productId);
            await wishlist.save();
        }

        const fullWishlist = await Wishlist.findById(wishlist._id).populate('products');
        res.status(200).json(fullWishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeFromWishlist = async (req, res) => { 
    try {
        const { productId } = req.params;
        let wishlist = await Wishlist.findOne({ userId: req.user.id });

        if (wishlist) {
            wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
            await wishlist.save();
            const fullWishlist = await Wishlist.findById(wishlist._id).populate('products');
            res.status(200).json(fullWishlist);
        } else {
            res.status(404).json({ message: 'Wishlist not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
