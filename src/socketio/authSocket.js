require("dotenv").config();
const jwt = require('jsonwebtoken')

const jwtVerify = (token, secret) =>
    new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) reject(err);
            resolve(decoded);
        });
    });

const authorizeUser = (socket, next) => {
    const token = socket.handshake.auth.token;
    jwtVerify(token, process.env.ACCESS_TOKEN_SECRET)
        .then(decoded => {
            socket.user = { ...decoded };
            next();
        })
        .catch(err => {
            console.log("Bad request!", err);
            next(new Error("Not authorized"));
        });
};

module.exports = authorizeUser;
