require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();


app.use(cors());
app.use(express.json());


app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce')
    .then(() => console.log(' MongoDB connected '))
    .catch((err) => console.log(' MongoDb error:', err));


app.get('/', (req, res) => {
    res.send('API  running');
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server running ${PORT}`);
});
