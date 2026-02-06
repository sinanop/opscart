const Order = require('../models/order');
const Cart = require('../models/cart');
const Product = require('../models/product');


exports.createOrder = async (req, res) => {
    try {
        const { address, paymentId, items, amount } = req.body;


        const cart = await Cart.findOne({ userId: req.user.id }).populate('products.productId');
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        for (const item of cart.products) {
            if (item.productId.stock < item.quantity) {
                return res.status(400).json({ message: `Product ${item.productId.name} is out of stock` });
            }
        }

        let totalAmount = 0;
        const orderItems = cart.products.map(item => {
            totalAmount += item.quantity * item.productId.price;
            return {
                productId: item.productId._id,
                quantity: item.quantity,
                price: item.productId.price
            };
        });

        const order = new Order({
            userId: req.user.id,
            products: orderItems,
            totalAmount: totalAmount,
            address,
            paymentId
        });

        const createdOrder = await order.save();

        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { soldCount: item.quantity, stock: -item.quantity }
            });
        }

        cart.products = [];
        await cart.save();

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        let orders;
        if (req.user.role === 'admin') {
            orders = await Order.find({}).sort({ createdAt: -1 }).populate('products.productId').populate('userId', 'name email phoneNumber');
        } else {
            orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 }).populate('products.productId').populate('userId', 'name email phoneNumber');
        }
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('products.productId').populate('userId', 'name email phoneNumber');
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status || order.status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (order.status === 'pending') {
            order.status = 'cancelled';
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(400).json({ message: 'Order cannot be cancelled' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
