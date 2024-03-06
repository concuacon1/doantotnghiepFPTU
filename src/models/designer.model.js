const mongoose = require('mongoose');
const { Schema } = mongoose;

const DesignerSchema = new Schema({
   designerId: { type: String, ref: 'users' },
   cv: { type: String },
}, { timestamps: true })

module.exports = mongoose.model("designers", DesignerSchema)
