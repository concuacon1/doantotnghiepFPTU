const express = require("express");
const morgan = require("morgan");
const path = require("path");
const exphbs = require('express-handlebars').engine;
const app = express();
const dotenv = require("dotenv");
const port = Number(process.env.PORT) || 8181;

app.use(express.static(path.join(__dirname, 'public')));
// HTTP logger
// app.use(morgan('combined'));

// Template engine
app.engine('hbs', exphbs({
   defaultLayout: 'main',
   extname: '.hbs'
}));

app.set('view engine', 'hbs');

app.set('views', path.join(__dirname + '/resources/views'));

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

app.listen(port, () => console.log(`Server running on: ${port}!`));
// dotenv.config();

// const connectDatabase = require("./lib/database");


// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// connectDatabase();

// routers(app);

// const port = Number(process.env.PORT) || 8181;

// app.listen(port, () => {
//    console.log("Server running on: ", port);
// });
