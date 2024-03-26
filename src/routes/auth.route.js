const express = require("express");

module.exports = async (router) => {
   //prefix
   router.use("/auth/", router);

   //api
   //localhost:8181/api/auth/login
   router.get("/login");
};
