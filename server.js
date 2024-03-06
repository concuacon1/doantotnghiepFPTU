const express = require('express');
require('dotenv').config()
const cors = require('cors');
var cookies = require("cookie-parser");
const path = require("path");
const multer = require('multer');

var app = express();
app.use(express.json());
app.use(cookies());
app.use(cors());
const mongoose = require('mongoose');
const URI = process.env.DATABASE_URL

mongoose.connect(URI, {
   useCreateIndex: true,
   useFindAndModify: false,
   useNewUrlParser: true,
   useUnifiedTopology: true
}, err => {
   if (err) throw err;
   console.log('Connected to MongoDB')
})

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, 'uploads/');
   },
   filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
   },
});

require('./src/queue/emailWorker');
app.use("/api", require('./src/routes/user.route'))

app.get('/', function (req, res) {
   res.send('Hello World!');
});
const port = process.env.PORT || 8000

app.listen(port, () => console.log(`Example app listening on port ${port}!`))