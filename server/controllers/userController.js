const User = require('../models/User');
const bcrypt = require('bcrypt');
const csv = require('csv-parser');
const fs = require('fs').promises;

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !['student', 'teacher', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid input' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Create user error:', error);
        if (error.code === 11000) {
            res.status(400).json({ message: 'Email already exists' });
        } else {
            res.status(500).json({ message: 'Server error' });
        }
    }
};

exports.bulkUploadUsers = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const results = [];
        const stream = require('fs').createReadStream(req.file.path).pipe(csv());

        for await (const data of stream) {
            results.push(data);
        }

        console.log('Parsed CSV data:', results);

        for (const record of results) {
            const { name, email, password, role } = record;
            if (name && email && password && ['student', 'teacher', 'admin'].includes(role)) {
                const hashedPassword = await bcrypt.hash(password, 10);
                const user = new User({ name, email, password: hashedPassword, role });
                await user.save();
                console.log(`User created: ${email}`);
            } else {
                console.log(`Invalid record: ${JSON.stringify(record)}`);
            }
        }

        await fs.unlink(req.file.path);
        res.status(200).json({ message: 'Bulk users uploaded successfully' });
    } catch (error) {
        console.error('Bulk upload error:', error);
        if (error.code === 11000) {
            res.status(400).json({ message: 'One or more emails already exist' });
        } else {
            res.status(500).json({ message: 'Server error' });
        }
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;
        const user = await User.findByIdAndUpdate(id, { name, email, role }, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        await StudentData.deleteOne({ userId: id });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
};