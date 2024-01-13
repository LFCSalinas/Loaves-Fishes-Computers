const mysql= require('mysql2/promise');

// Enables use of .env
require("dotenv").config();

const pool = mysql.createPool(process.env.JAWSDB_URL)

module.exports = pool;