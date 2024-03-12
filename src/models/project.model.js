

const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProjectSchema = new Schema({
    name: { type: String },
    projectIdType :  { type: String, ref: 'users' },
    projectImage : { type: String },
    designerId  :{ type: String },
    designerDate :  { type : Date},
    constructionDate :  { type : Date},
    catalog :  { type : String}
}, { timestamps: true })

module.exports = mongoose.model("project", ProjectSchema)
