const mongoose = require('mongoose');
const User = require('./models/user');
const Product = require('./models/product');
const Order = require('./models/order');
require('dotenv').config();

const localUri = 'mongodb://localhost:27017/ecommerce';
const cloudUri = process.env.MONGO_URI;

const migrate = async () => {
    console.log('Starting Migration...');
    console.log('Local URI:', localUri);
 
    console.log('Cloud URI exists:', !!cloudUri);

    if (!cloudUri) {
        console.error(' Cloud URI not defined in');
        process.exit(1);
    }

    try {
      
        console.log(' Connecting  DB');
        await mongoose.connect(localUri);
        console.log(' Connected to Local.');

        const users = await User.find({});
        const products = await Product.find({});
        const orders = await Order.find({});

        console.log(` Fetched from Local: ${users.length} Users, ${products.length} Products, ${orders.length} Orders.`);

        await mongoose.disconnect();
        console.log(' Disconnected from Local.');

        if (users.length === 0 && products.length === 0) {
            console.warn(' Local DB appears empty.');
            process.exit(0);
        }

    
        console.log(' Connecting to DB');
        await mongoose.connect(cloudUri);
        console.log(' Connected to Cloud.');

        console.log(' Clearing existing Cloud dat');
        await User.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});

        console.log(' Uploading data to Cloud...');
        if (users.length > 0) await User.insertMany(users);
        if (products.length > 0) await Product.insertMany(products);
        if (orders.length > 0) await Order.insertMany(orders);

        console.log(' Migration Complete!');
        process.exit(0);

    } catch (error) {
        console.error(' Migration Error:', error);
        process.exit(1);
    }
};

migrate();
