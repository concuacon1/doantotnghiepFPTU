const express = require('express');
const router = express.Router();
const Designer = require('../models/designer.model');

// Get all designers
router.get('/list_designers', async (req, res) => {
    try {
        const designers = await Designer.find();
        res.json(designers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new designer
router.post('/add_designer', async (req, res) => {
    const designer = new Designer({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    try {
        const newDesigner = await designer.save();
        res.status(201).json(newDesigner);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update designer
router.patch('/edit_designer/:id', async (req, res) => {
    try {
        const designer = await Designer.findById(req.params.id);
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
});

// Delete designer
router.delete('/delete_designer/:id', async (req, res) => {
    try {
        const designer = await Designer.findById(req.params.id);
        await designer.remove();
        res.json({ message: 'Designer deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
