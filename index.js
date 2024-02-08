const express = require("express");
const app = express();
const dotenv = require("dotenv");

app.get('/', (req, res) => res.send("Hello World"));
const port = Number(process.env.PORT) || 8181;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
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
