const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart, updateCartItem } = require('../controllers/cartController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/', updateCartItem);
router.delete('/:productId', removeFromCart);

module.exports = router;
