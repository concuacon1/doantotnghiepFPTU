// designer.model.js
const mongoose = require('mongoose');

const designerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Email là duy nhất
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String // Đường dẫn đến tệp avatar
    }
});

module.exports = mongoose.model('Designer', designerSchema);
