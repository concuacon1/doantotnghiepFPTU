const express = require("express");

const router = express.Router();

const userRoute = require("./user.route");
const authRoute = require("./auth.route");

const routers = (app) => {
   //localhost:8181/api/hello
   app.use("/api/", router);

   //User Router
   //localhost:8181/api/
   userRoute(router);

   //auth router
   authRoute(router);


   app.get('/', (req, res) => {
      res.render('home');
   })

   app.get('/project', (req, res) => {
      res.render('project');
   })

   app.get('/search', (req, res) => {
      res.render('search');
   })

   app.get('/login', (req, res) => {
      res.render('login');
   })

   app.post('/search', (req, res) => {
      res.send('');
   })
};

module.exports = routers;
