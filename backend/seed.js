const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected...'))
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

const User = require('./src/models/User');
const Task = require('./src/models/Task');
const Video = require('./src/models/Video');
const Sponsorship = require('./src/models/Sponsorship');

const importData = async () => {
    try {
        await User.deleteMany();
        await Task.deleteMany();
        await Video.deleteMany();
        await Sponsorship.deleteMany();

        // Hash password before creating test user
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('password123', salt);

        // We bypass standard save here to avoid double hashing, or we use .create
        // Wait, User schema hashes using pre('save'). If we use create with 'password123', it will hash it.
        const createdUser = await User.create({
            name: 'Demo Creator',
            email: 'demo@influencerz-hub.com',
            password: 'password123',
            role: 'user'
        });

        const adminUser = await User.create({
            name: 'Super Admin',
            email: 'admin@influencerz-hub.com',
            password: 'password123',
            role: 'admin'
        });

        console.log('User created:', createdUser.email);
        console.log('Admin created:', adminUser.email);

        const tasks = [
            { content: 'Research MacBook M5 rumors', status: 'ideas', tag: 'Tech', order: 0, user: createdUser._id },
            { content: 'Plan desk setup b-roll', status: 'ideas', tag: 'Setup', order: 1, user: createdUser._id },
            { content: 'Script: Why DaVinci Resolve is better', status: 'scripting', tag: 'Editing', order: 0, user: createdUser._id },
            { content: 'Film intro for Sony A7RV review', status: 'filming', tag: 'Camera', order: 0, user: createdUser._id },
            { content: 'Color grade Iceland vlogs', status: 'editing', tag: 'Vlog', order: 0, user: createdUser._id },
            { content: 'Top 5 AI tools for creators', status: 'published', tag: 'AI', order: 0, user: createdUser._id },
        ];

        await Task.insertMany(tasks);
        console.log('Tasks inserted');

        const videos = [
            { title: 'Top 5 AI tools for creators', description: 'These AI tools will save you 100 hours a month.', url: 'https://youtube.com/watch?v=1', user: createdUser._id },
            { title: 'My 2026 Desk Setup', description: 'The absolute best desk setup for productivity.', url: 'https://youtube.com/watch?v=2', user: createdUser._id }
        ];

        await Video.insertMany(videos);
        console.log('Videos inserted');

        const sponsorships = [
            { brand: 'Squarespace', amount: 3500, user: createdUser._id },
            { brand: 'Epidemic Sound', amount: 1500, user: createdUser._id },
            { brand: 'Notion', amount: 5000, user: createdUser._id }
        ];

        await Sponsorship.insertMany(sponsorships);
        console.log('Sponsorships inserted');

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
};

importData();
