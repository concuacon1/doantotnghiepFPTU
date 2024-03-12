
const ProjectTypeSchema = require("../models/projectType.model");
const ProjectSchema = require("../models/project.model")
const CategoriesSchema = require("../models/categories.model")
const UserSchema = require('../models/user.model');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const project = {
    create_project_type: async (req, res) => {
        const { nameProjectType } = req.body
        const data = await ProjectTypeSchema.findOne({ nameProjectType });
        if (data) {
            return res.status(400).json({ message: "projectType đã tồn tại trong hệ thống" })
        }

        const datasave = new ProjectTypeSchema({
            nameProjectType: nameProjectType,
        });
        const dataCreate = await datasave.save();
        return res.json({
            message: "",
            data: {
                id: dataCreate._id
            }
        })
    },

    get_project_type: async (req, res) => {
        const data = await ProjectTypeSchema.find();
        return res.json({
            message: "",
            data: {
                listProjectType: data,
            }
        })
    },

    check_project_type: async (req, res) => {
        const { nameProjectTypeNew } = req.body;
        const data = await ProjectTypeSchema.findOne({ nameProjectType: nameProjectTypeNew });
        if (data) {
            return res.status(400).json({ message: "projectTypeNew đã tồn tại trong hệ thống" })
        }
    },
    check_design: async (req, res) => {
        const { userCode } = req.body;
        const data = await UserSchema.findOne({ userCode: userCode, role: "DESIGNER" }).select("-password");
        return res.json({
            message: "Success",
            data: {
                data: data,
            }
        })
    },

    create_project_category: async (req, res) => {
        const data = req.body;
        const { listCategory } = req.body;
        const datasave = new ProjectSchema({
            ...data,
        })
        const dataCreate = await datasave.save();
        for (let index = 0; index < listCategory.length; index++) {
            const datasaveCategory = new CategoriesSchema({
                categoriesName: listCategory[index].categoriesName,
                images: listCategory[index].images,
                projectIds: dataCreate._id,
            })
            console.log(datasaveCategory)
            await datasaveCategory.save();
        }
        return res.json({
            message: "Success",
            data: {
                listProjectType: data,
            }
        })
    },
    get_project_category: async (req, res) => {
        const data = await ProjectSchema.find({ _id: { $gt: "000000000000000000000000" } })
            .sort({ _id: -1 })
            .limit(24)
            .exec();

        return res.json({
            message: "Success",
            data: {
                listProject: data,
            }
        })
    },
    get_project_category_id: async (req, res) => {
        const { id } = req.params;
        // projectIds
        const data = await ProjectSchema.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(id),
                },
            },
            {
                $lookup: {
                    from: 'categories', // The name of the collection to join
                    localField: '_id', // Assuming projectIds is an array of ObjectId
                    foreignField: 'projectIds',
                    as: 'categoryData',
                },
            },
        ]);


        return res.json({
            message: "Success",
            data: {
                listProject: data,
            }
        })
    },
}

module.exports = project