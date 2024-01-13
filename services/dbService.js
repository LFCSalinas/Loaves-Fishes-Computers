// Database Service - Decoupled Database Queries
const jawsdb = require("../server/repository/jawsdb.js");
require("dotenv").config();


// Given Email, return a single record (first match) else null
exports.findUserByEmail = async (email) => {
    const [result] = await jawsdb.query("SELECT * FROM user WHERE email = ?", [email]);
    return result[0];
}

// Given ID, return a single record (first match) else null
exports.findUserById = async (id) => {
    const [result] = await jawsdb.query("SELECT * FROM user WHERE id = ?", [id]);
    return result[0];
};

// Given Args, INSERT INTO user
exports.addUser = async (first_name, last_name, email, password, token, member_since) => {
    const [result] = await jawsdb.query(
        "INSERT INTO user (first_name, last_name, email, password, token, member_since) VALUES (?,?,?,?,?,?)", [first_name, last_name, email, password, token, member_since]
    );
    return result.insertId;
};

// Given Arg, UPDATE user | Note: This is not ideal, as it forces specific data column references. However, it is versatile.
exports.setUserDataById = async (data, id) => {
    await jawsdb.query("UPDATE user SET ? WHERE id = ?", [data, id])
    const [updatedRows] = await jawsdb.query("SELECT * FROM user WHERE id = ?", [id]);
    return updatedRows[0];
}

// UPDATE 'status' field to 'Active'
exports.activateUser = async (email) => {
    return await jawsdb.query("UPDATE user SET status = 'Active' WHERE email = ?", [email])
}

// DELETE all users
exports.deleteAllUsers = async () => {
    return await jawsdb.query("DELETE FROM user")
}

exports.deleteUserById = async (id) => {
    await jawsdb.query("UPDATE user SET email = ?, status = ? WHERE id = ?", [null, "Deleted", id])
    const [updatedRows] = await jawsdb.query("SELECT * FROM user WHERE id = ?", [id]);
    return updatedRows[0];
}

exports.findUserBySearch = async (searchTerm) => {
    const [results] = await jawsdb.query("SELECT * FROM user WHERE (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?) && status != 'Deleted'", ["%" + searchTerm + "%", "%" + searchTerm + "%", "%" + searchTerm + "%"]);
    return results;
}
