const mongoose = require("mongoose");

const USER_MODEL = "users";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      maxlength: 32,
      minlength: 1,
      required: true,
    },
    lastName: {
      type: String,
      maxlength: 32,
      minlength: 1,
      required: true,
    },
    fullName: {
      type: String,
      required: false,
      default: null,
    },
    email: {
      type: String,
      maxlength: 64,
      minlength: 1,
      required: true,
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE"],
      required: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "CUSTOMER"],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: USER_MODEL },
);

module.exports = mongoose.model(USER_MODEL, userSchema);
