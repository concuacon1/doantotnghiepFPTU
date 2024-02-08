const express = require("express");
const router = express.Router(); 
const createUserController = require("../controllers/users/user.controller")
const routers = (app) => {
   app.post("/create-user",createUserController)
}

module.exports = routers