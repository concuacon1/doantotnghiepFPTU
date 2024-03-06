const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const UserSchema = require('../models/user.model');
const CustomerSchema = require('../models/customer.model')
const DesignerSchema = require("../models/designer.model")
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const emailQueue = require('../queue/sendEmailQueue');

const user = {
   register_user: async (req, res) => {
      const resultValidator = validationResult(req);
      if (!resultValidator.isEmpty()) {
         return res.status(402).send({ errors: resultValidator.array() })
      }
      const data = req.body;
      const { email, password, role, phoneNumber } = data;
      const checkHaveEmail = await UserSchema.findOne({ email });
      if (checkHaveEmail) {
         return res.status(400).json({ message: "Email đã tồn tại trong hệ thống" })
      }
      const checkHavephone = await UserSchema.findOne({ phoneNumber });
      if (checkHavephone) {
         return res.status(400).json({ message: "phoneNumber đã tồn tại trong hệ thống" })
      }

      const hasspassword = bcrypt.hashSync(password, 10);
      let userCode = "";
      let roleUser = " ";
      while (userCode.length == 0 && roleUser != "ADMIN") {
         if (role === "DESIGNER") {
            userCode = randomUserCode("DE");
         } else if (role === "CUSTOMER") {
            userCode = randomUserCode("KH");
         } else if (role === "STAFF") {
            userCode = randomUserCode("ST");
         }
         const findData = await UserSchema.findOne({ userCode: userCode });
         if (findData && findData.role == "ADMIN") {
            roleUser = "ADMIN"
         } else if (findData && findData.role != "ADMIN") {
            userCode = ""
         }
      }

      const datasave = new UserSchema({
         ...data,
         userCode: userCode.toUpperCase(),
         password: hasspassword
      })
      const userCreate = await datasave.save();
      if (role == "CUSTOMER") {
         const { businessName, customerType } = req.body
         const datasaveCustomer = new CustomerSchema({
            customerId: userCreate._id,
            businessName: businessName,
            customerType: customerType
         })
         await datasaveCustomer.save();
      }

      if (role == "DESIGNER") {
         const { cv } = req.body
         const datasaveDesigner = new DesignerSchema({
            designerId: userCreate._id,
            cv: cv,
         })
         await datasaveDesigner.save();
      }
      const accesstoken = createAccessToken({ id: userCreate._id, role: userCreate.role })
      return res.json({
         message: "Tạo tài khoản thành công", data: {
            informationuser: { email, role },
            cookie: accesstoken
         }
      })
   },
   login_email: async (req, res) => {

      const { email, password } = req.body

      const userdata = await UserSchema.findOne({ email: email });
      if (!userdata) {
         return res.status(400).json({ message: "Tài khoản của bạn sai " })
      }
      const isMatch = bcrypt.compareSync(password, userdata.password)
      if (!isMatch) {
         return res.status(400).json({ message: "Mật khẩu của bạn không đúng " })
      }
      const accesstoken = createAccessToken({ id: userdata._id, role: userdata.role })
      return res.status(200).json({ message: "", data: { informationuser: { email: email, role: userdata.role }, cookie: accesstoken } });

   },
   login_phone: async (req, res) => {
      const { phoneNumber, password } = req.body

      const userdata = await UserSchema.findOne({ phoneNumber });
      if (!userdata) {
         return res.status(400).json({ message: "phoneNumber của bạn sai " })
      }
      const isMatch = await bcrypt.compare(password, userdata.password)
      if (!isMatch) {
         return res.status(400).json({ message: "Mật khẩu của bạn không đúng " })
      }
      const accesstoken = createAccessToken({ id: userdata._id, role: userdata.role })
      return res.status(200).json({ message: "", data: { informationuser: { email: userdata.email, role: userdata.role }, cookie: accesstoken } })
   },
   get_list_user: async (req, res) => {
      const idUser = req.dataToken.id;
      const listUser = await UserSchema.aggregate([
         {
            $project: { password: 0 }
         },
         {
            $match: {
               _id: { $ne: ObjectId(idUser) },
               role: { $ne: "ADMIN" }
            }
         },

      ])
      return res.json({ message: "", data: listUser })
   },
   search_list_user: async (req, res) => {
      const { userCode, fullName, role, startDate, endDate } = req.body;
      const idUser = req.dataToken.id;
      const listUser = await UserSchema.aggregate([
         {
            $project: { password: 0 }
         },
         {
            $match: {
               _id: { $ne: ObjectId(idUser) },
               role: { $ne: "ADMIN" }
            }
         },
         {
            $match: {
               $and: [
                  { userCode: { $regex: new RegExp(userCode, 'i') } },
                  { fullName: { $regex: new RegExp(fullName, 'i') } },
                  { role: { $regex: new RegExp(role, 'i') } },
                  {
                     createdAt: {
                        $gte: startDate,
                        $lte: endDate,
                     },
                  }
               ]
            }
         }
      ])
      return res.json({ message: "", data: listUser })
   },

   delete_user: async (req, res) => {
      try {
         const idDelete = req.params.id;
         await UserSchema.deleteOne({ _id: ObjectId(idDelete) })
         return res.json({ message: "Xóa thành công" })
      } catch (error) {
         return res.status(500).json({ message: "Xóa error" })
      }

   },
   change_password: async (req, res) => {
      try {
         const resultValidator = validationResult(req);
         if (!resultValidator.isEmpty()) {
            return res.status(400).send({ errors: resultValidator.array() })
         }
         const idUser = req.dataToken.id;
         const { passwordNew, passwordOld } = req.body;
         const dataUser = await UserSchema.findOne({ _id: ObjectId(idUser) })
         if (dataUser) {
            const isMatch = bcrypt.compareSync(passwordOld, dataUser.password);
            if (isMatch) {
               const hasspassword = bcrypt.hashSync(passwordNew, 10);
               const result = await UserSchema.updateOne(
                  { _id: ObjectId(idUser) },
                  { $set: { password: hasspassword } }
               );
               return res.status(200).json({ message: "Mật khẩu đã được thay đổi" })
            } else {
               return res.status(400).json({ message: "Mật khẩu cũ không đúng" })
            }

         } else {
            return res.status(400).json({ message: "Tài khoản không tồn tại" })
         }

      } catch (error) {
         return res.status(500).json({ message: "Server error" })
      }

   },
   send_otp: async (req, res) => {
      const { email } = req.body;
      try {
         const userdata = await UserSchema.findOne({ email: email });
         if (userdata) {
            const getOtp = randomOTP();
            await UserSchema.updateOne(
               { email: email },
               { $set: { code_change_password: getOtp } }
            );
            const dataSendEamil = {
               OTP: getOtp,
               emailTo: email
            };
            await emailQueue.add('send-email', dataSendEamil);
         } else {
            return res.json({ message: "Tài khoản của bạn không chính xác" })
         }
         return res.json({ message: "Mã OTP đã được gửi tới email" })
      } catch (error) {
         console.log(error)
         return res.status(500).json({ message: "Error error" })
      }

   },
   change_password_otp: async (req, res) => {
      const { code_change_password, email, passwordNew } = req.body;
      try {
         const userdata = await UserSchema.findOne({ email: email, code_change_password: code_change_password });
         if (userdata) {
            const hasspassword = bcrypt.hashSync(passwordNew, 10);
            await UserSchema.updateOne(
               { email: email },
               { $set: { password: hasspassword, code_change_password: "" } }
            );
         } else {
            return res.status(400).json({ message: "Tài khoản  hoặc mã otp của bạn không chính xác" })
         }
         return res.json({ message: "Thay đổi mật khẩu thành công" })
      } catch (error) {
         return res.status(500).json({ message: "Error error" })
      }

   },
   uploadFile: async (req, res) => {
      if (req.file) {
         res.json({ success: true, filename: req.file.filename });
      } else {
         res.json({ success: false, message: 'File upload failed' });
      }
   },

   informationController: async (req, res) => {
      const idUser = req.dataToken.id;
      console.log(idUser)
      const data = await UserSchema.findOne({ _id: idUser }).select('-password');
      return res.json({ message: data })
   },
}

const createAccessToken = (data) => {
   return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '11h' })
}

const randomUserCode = (data) => {
   const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
   let randomString = data;
   for (let i = 0; i < 6; i++) {
      let random = "";
      random = characters.charAt(Math.floor(Math.random() * characters.length));
      randomString += random;
   }
   return randomString;
}


const randomOTP = () => {
   const length = Math.floor(Math.random() * 3) + 5;
   const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
   let randomString = '';
   for (let i = 0; i < length; i++) {
      random = Math.floor(Math.random() * characters.length)
      randomString += random;
   }

   return randomString;
}

module.exports = user