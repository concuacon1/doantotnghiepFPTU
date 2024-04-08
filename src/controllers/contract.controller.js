
const ContractSchema = require("../models/contract.model");
const ProjectSchema = require("../models/project.model")
const CategoriesSchema = require("../models/categories.model")
const UserSchema = require('../models/user.model');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const emailQueue = require('../queue/sendEmailQueue');

const contract = {
    create_contract: async (req, res) => {
        const { codeContract } = req.body
        const findCodeContract = await ContractSchema.findOne({ codeContract: codeContract })
        if (findCodeContract) {
            return res.status(400).json({ message: "Mã hợp đồng đã tồn tại" });
        }
        const newContract = new ContractSchema({
            ...req.body
        })
        await newContract.save();
        return res.json({
            message: "Create success",
            data: {

            }
        })

    },
    delete_contract: async (req, res) => {
        const { id } = req.params;
        await CategoriesSchema.updateOne({ _id: id }, { $set: { isDelete: true } });
        return res.json({
            message: "Delete success",
            data: {

            }
        })

    },
    contract_persion: async (req, res) => {
        const custormerId = req.dataToken.id;
        const listContract = await ContractSchema.find({ custormerId: custormerId });
        return res.json({
            message: "get success",
            data: {
                listContract: listContract
            }
        })
    },
    list_contract: async (req, res) => {
        const listData = await ContractSchema.aggregate([
            {
                $match: {
                    isDelete: false
                }
            },
            {
                $lookup: {
                    from: 'users',
                    let: { custormerId: '$custormerId' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$custormerId'] }
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                fullName: 1,
                                email: 1 // Include other fields you want to retrieve
                            }
                        }
                    ],
                    as: 'customerData'
                }
            }
        ]);

        return res.json({
            message: "get list success",
            data: {
                listContract: listData
            }
        })
    },
    check_contract: async (req, res) => {
      const { userCode} = req.body;
      const dataFind = await UserSchema.findOne({userCode : userCode , isActive : true, isDelete :false }).select("_id fullName");
      if(!dataFind){
        return res.status(400).json({ message: "Không tồn tại mã khách hàng" });
      }
      return res.json({
        message: "get list success",
        data: {
            dataCustomer: dataFind
        }
    })
    },

    email_consulation :  async (req, res) => {
        const {  emailCustomer, fullName ,  phone , note } = req.body
        const dataSendEamil = {
            emailCustomer, fullName ,  phone , note
        };
        await emailQueue.add('send-customer-consulation', dataSendEamil);
        return res.json({
            message: "Email thông báo cần tư vấn thành công",
            data: {
            }
        })
    },
    get_contract_detail: async (req, res) => {
        const dataFind = await ContractSchema.find({ _id: req.params.id });
        if (!dataFind) {
            return res.status(400).json({ message: "Không tồn tại hợp đồng" });
        }
        return res.json({
            message: "get contract success",
            data: {
                contract: dataFind
            }
        })
    },
    

}

module.exports = contract