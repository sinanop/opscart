const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const Product = require('./models/product');
const User = require('./models/user');

dotenv.config();

const Order = require('./models/order');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce', {

}).then(() => console.log('MongoDB connected for seeding'))
    .catch(err => console.error(err));

const importData = async () => {
    try {
        const dbPath = path.join(__dirname, '../db.json');
        const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();


        const userMap = {};
        const productMap = {};


        const usersToInsert = await Promise.all(dbData.users.map(async u => {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(u.password, salt);

            return {
                _id: new mongoose.Types.ObjectId(),
                oldId: u.id,
                name: u.name,
                email: u.email,
                password: hashedPassword,
                role: u.role,
                address: u.address || '',
                phoneNumber: u.phone || '',
                status: u.status || 'Active'
            };
        }));


        usersToInsert.forEach(u => {
            userMap[u.oldId] = u._id;
            delete u.oldId;
        });
        await User.insertMany(usersToInsert);
        console.log(`Imported ${usersToInsert.length} Users`);


        const productsToInsert = dbData.products.map(p => ({
            _id: new mongoose.Types.ObjectId(),
            oldId: p.id,
            name: p.name,
            price: p.price,
            km: p.km,
            fuel: p.fuel,
            image: p.image,
            category: 'Car',
            description: `${p.name} - ${p.km} - ${p.fuel}`,
            stock: 10
        }));

        productsToInsert.forEach(p => {
            productMap[p.oldId] = p._id;
            delete p.oldId;
        });
        await Product.insertMany(productsToInsert);
        console.log(`Imported ${productsToInsert.length} Products`);


        const ordersToInsert = dbData.orders.map(o => {
            const newUserId = userMap[o.userId];
            if (!newUserId) return null;

            const orderProducts = (o.items || []).map(item => {
                const newProdId = productMap[item.id];
                if (!newProdId) return null;
                return {
                    productId: newProdId,
                    quantity: item.quantity || 1,
                    price: item.price
                };
            }).filter(i => i !== null);

            if (orderProducts.length === 0) return null;

            return {
                userId: newUserId,
                products: orderProducts,
                totalAmount: o.total,
                address: o.address || {},
                status: (o.status || 'pending').toLowerCase(),
                paymentId: 'COD',
                createdAt: o.date ? new Date(o.date) : new Date()
            };
        }).filter(o => o !== null);

        await Order.insertMany(ordersToInsert);
        console.log(`Imported ${ordersToInsert.length} Orders`);

        console.log('Data Imported Successfully with Hashed Passwords and Relations!');
        process.exit();
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
};

importData();
