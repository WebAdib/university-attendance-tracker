const User = require('../models/User');
const Department = require('../models/Department');
const Course = require('../models/Course');
const Notice = require('../models/Notice');
const multer = require('multer');
const fs = require('fs').promises;

const upload = multer({ dest: 'uploads/' });

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('name email role');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { email, adminPassword } = req.body;
        const admin = await User.findOne({ email: req.user.email, role: 'admin' });
        if (!admin || admin.password !== adminPassword) {
            return res.status(403).json({ message: 'Invalid admin password' });
        }
        const user = await User.findOneAndDelete({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addDepartment = async (req, res) => {
    try {
        const { name } = req.body;
        const department = new Department({ name });
        await department.save();
        res.status(201).json({ message: 'Department added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addCourse = async (req, res) => {
    try {
        const { name, department } = req.body;
        const course = new Course({ name, department });
        await course.save();
        res.status(201).json({ message: 'Course added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addNotice = async (req, res) => {
    try {
        const { title, content, startDate, endDate } = req.body;
        const notice = new Notice({ title, content, startDate, endDate });
        await notice.save();
        res.status(201).json({ message: 'Notice added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.setFormFillUp = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        // Placeholder: Store form details (e.g., in a Form model or config)
        res.status(200).json({ message: 'Form fill-up dates set successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getFormSubmissions = async (req, res) => {
    try {
        // Placeholder: Fetch form submissions
        const submissions = await api.get('/students/submit-form/status'); // Adjust based on actual endpoint
        res.status(200).json(submissions.data);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};