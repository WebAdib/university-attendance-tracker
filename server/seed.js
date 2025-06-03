const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const StudentData = require('./models/StudentData');
require('dotenv').config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');

        // Clear existing data
        await User.deleteMany({});
        await StudentData.deleteMany({});

        // Create a student user
        const hashedPassword = await bcrypt.hash('password123', 10);
        const student = new User({
            name: 'Test Student',
            email: 'student@example.com',
            password: hashedPassword,
            role: 'student',
        });
        const savedStudent = await student.save();

        // Create student data
        const studentData = new StudentData({
            userId: savedStudent._id,
            attendanceRecords: [
                { date: new Date('2025-06-01'), present: true },
                { date: new Date('2025-06-02'), present: true },
                { date: new Date('2025-06-03'), present: false },
            ],
            incourseMarks: 80,
            eligibleForForm: true,
        });
        await studentData.save();

        console.log('Database seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();