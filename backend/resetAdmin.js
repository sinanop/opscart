const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
require('dotenv').config();

const resetAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const adminEmail = 'admin@gmail.com';
        const newPassword = 'admin123';

        let admin = await User.findOne({ email: adminEmail });

        if (admin) {
            console.log('Admin found. Updating password...');
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash(newPassword, salt);
     
            admin.role = 'admin';
            await admin.save();
            console.log('Admin password reset successfully.');
        } else {
            console.log('Admin not found. Creating new admin...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            admin = new User({
                name: 'Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                status: 'Active'
            });
            await admin.save();
            console.log('Admin created successfully.');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

resetAdmin();
