import mysql from 'mysql2/promise'
// Enables use of .env
import 'dotenv/config.js';



const pool = mysql.createPool(process.env.JAWSDB_URL)

export default pool;