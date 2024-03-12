const mongoose = require('mongoose');

const designerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const Designer = mongoose.model('Designer', designerSchema);

module.exports = Designer;
