const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrderById, updateOrder, cancelOrder } = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);
router.patch('/:id', adminMiddleware, updateOrder);
router.put('/:id/cancel', cancelOrder);

module.exports = router;
