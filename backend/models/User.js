const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['student', 'senior', 'admin'],
        required: true,
    },
    // Role-specific fields
    college: {
        type: String,
        required: function () { return this.role === 'student'; }
    },
    graduationYear: {
        type: String,
    },
    targetCompanies: {
        type: String,
    },
    company: {
        type: String,
        required: function () { return this.role === 'senior'; }
    },
    designation: {
        type: String,
    },
    linkedin: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
