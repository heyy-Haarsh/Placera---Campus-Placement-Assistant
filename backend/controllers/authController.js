const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, college, graduationYear, targetCompanies, company, designation, linkedin } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            college,
            graduationYear,
            targetCompanies,
            company,
            designation,
            linkedin
        });

        await newUser.save();

        // Generate JWT
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '1d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error("Registration Error", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Hardcoded admin check across any role tab
        if (email === 'admin' && password === 'admin@123') {
            const token = jwt.sign(
                { id: 'admin123', role: 'admin' },
                process.env.JWT_SECRET || 'secretkey',
                { expiresIn: '1d' }
            );
            return res.status(200).json({
                message: 'Admin logged in successfully',
                token,
                user: {
                    id: 'admin123',
                    name: 'Admin',
                    email: 'admin',
                    role: 'admin'
                }
            });
        }

        // Student/Senior login
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (user.role !== role) {
            return res.status(403).json({ message: 'Role mismatch' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Logged in successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login Error", error);
        res.status(500).json({ message: 'Server error' });
    }
};
