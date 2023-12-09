// Database Service - Decoupled Database Logic
const mysql = require("mysql2");
const db = require("../../db.js");

exports.findUserByEmail = (email, callback) => {
    db.query("SELECT email FROM user WHERE email = ?", [email], async (err, results) => {
        // Pass the err and results to the callback function
        callback(err, results);
    });
};