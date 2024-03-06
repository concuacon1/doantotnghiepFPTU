

const mongoose = require('mongoose');
const { Schema } = mongoose;
const { bussiness_arr } = require("../common/enum.database");

const CustomerSchema = new Schema({
   customerId: { type: String, ref: 'users' },
   businessName: {
      type: String,
      default: ""
   },
   customerType: {
      type: String,
      enum: bussiness_arr,
   }

}, { timestamps: true })

module.exports = mongoose.model("customer", CustomerSchema)
