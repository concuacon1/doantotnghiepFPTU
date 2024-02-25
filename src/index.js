const express = require("express");
const morgan = require("morgan");
const path = require("path");
const exphbs = require('express-handlebars').engine;
const app = express();
const dotenv = require("dotenv");
const port = Number(process.env.PORT) || 8181;
const routers = require("./routes/index.route");

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
//Router init
routers(app);

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
