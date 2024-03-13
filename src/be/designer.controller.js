const Designer = require('../models/designer.model');

// Controller function to create a new designer
exports.create = async (req, res) => {
    try {
        const designer = new Designer({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        const newDesigner = await designer.save();
        res.status(201).json(newDesigner);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller function to get all designers
exports.getAll = async (req, res) => {
    try {
        const designers = await Designer.find();
        res.json(designers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller function to get a designer by ID
exports.getById = async (req, res) => {
    try {
        const designer = await Designer.findById(req.params.id);
        if (designer) {
            res.json(designer);
        } else {
            res.status(404).json({ message: 'Designer not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller function to update a designer
exports.update = async (req, res) => {
    try {
        const designer = await Designer.findById(req.params.id);
        if (!designer) {
            return res.status(404).json({ message: 'Designer not found' });
        }
        if (req.body.name) {
            designer.name = req.body.name;
        }
        if (req.body.email) {
            designer.email = req.body.email;
        }
        if (req.body.password) {
            designer.password = req.body.password;
        }
        const updatedDesigner = await designer.save();
        res.json(updatedDesigner);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller function to delete a designer
exports.delete = async (req, res) => {
    try {
        const designer = await Designer.findById(req.params.id);
        if (!designer) {
            return res.status(404).json({ message: 'Designer not found' });
        }
        await designer.remove();
        res.json({ message: 'Designer deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller function to upload an avatar for a designer
exports.uploadAvatar = async (req, res) => {
    try {
        res.json({ message: 'Avatar uploaded successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
