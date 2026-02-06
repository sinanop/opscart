const Cart = require('../models/cart');
const Product = require('../models/product');


exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate('products.productId');
        if (!cart) {
            return res.json({ products: [] });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        let cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            cart = new Cart({ userId: req.user.id, products: [] });
        }

        const productIndex = cart.products.findIndex(p => String(p.productId) === String(productId));

        if (productIndex > -1) {
            
            return res.status(400).json({ message: 'This car is already in your cart. You can only buy 1 quantity of each car.' });
        } else {
           
            cart.products.push({ productId, quantity: 1 });
        }

        await cart.save();
        const fullCart = await Cart.findById(cart._id).populate('products.productId');
        res.status(200).json(fullCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        let cart = await Cart.findOne({ userId: req.user.id });

        if (cart) {
            cart.products = cart.products.filter(p => p.productId.toString() !== productId);
            await cart.save();
            const fullCart = await Cart.findById(cart._id).populate('products.productId');
            res.status(200).json(fullCart);
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        let cart = await Cart.findOne({ userId: req.user.id });

        if (cart) {
            const product = cart.products.find(p => p.productId.toString() === productId);
            if (product) {
                product.quantity = quantity;
                await cart.save();
                const fullCart = await Cart.findById(cart._id).populate('products.productId');
                res.json(fullCart);
            } else {
                res.status(404).json({ message: 'Product not found in cart' });
            }
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
