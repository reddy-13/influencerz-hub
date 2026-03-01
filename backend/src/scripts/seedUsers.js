const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

const seedUsers = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/influencehub');
        console.log('MongoDB Connected.');

        console.log('Clearing old data...');
        await User.deleteMany({});

        console.log('Hashing default password for seeded users...');
        const salt = await bcrypt.genSalt(10);
        const defaultPassword = await bcrypt.hash('password123', salt);

        console.log('Generating realistic data...');
        const usersToInsert = [];

        // Push the guaranteed Admin Account!
        usersToInsert.push({
            name: 'Master Admin',
            email: 'admin@influencehub.com',
            password: defaultPassword,
            role: 'admin',
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Push the guaranteed Demo User!
        usersToInsert.push({
            name: 'Demo User',
            email: 'demo@influencehub.com',
            password: defaultPassword,
            role: 'user',
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen', 'Alex', 'Chris', 'Taylor', 'Jordan', 'Casey'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
        const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'influencehub.local', 'creator.network'];

        // Let's generate 498 random users so we get 500 total
        const TOTAL_USERS = 498;

        for (let i = 0; i < TOTAL_USERS; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const domain = domains[Math.floor(Math.random() * domains.length)];

            // random date within the last year
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 365));

            usersToInsert.push({
                name: `${firstName} ${lastName}`,
                email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 10000)}@${domain}`,
                password: defaultPassword,
                role: Math.random() > 0.95 ? 'admin' : 'user', // ~5% admins
                status: Math.random() > 0.85 ? 'suspended' : 'active', // ~15% suspended
                createdAt: date,
                updatedAt: date
            });
        }

        console.log(`Inserting ${TOTAL_USERS} users in batches...`);

        // Insert in batches of 100
        const batchSize = 100;
        for (let i = 0; i < usersToInsert.length; i += batchSize) {
            const batch = usersToInsert.slice(i, i + batchSize);
            await User.insertMany(batch);
            console.log(`Inserted batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(usersToInsert.length / batchSize)}`);
        }

        console.log('Seeding Complete! 🎉');
        process.exit();
    } catch (error) {
        console.error('Error with import data', error);
        process.exit(1);
    }
};

seedUsers();
