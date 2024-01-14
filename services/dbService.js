// Database Service - Decoupled Database Queries
const jawsdb = require("../server/repository/jawsdb.js");
const db = require("../server/repository/db");
require("dotenv").config();


// Get user(s) given arg
exports.findUserByEmail = async (email) => {
    const [result] = await jawsdb.query("SELECT * FROM user WHERE email = ?", [email]);
    return result[0];
}

exports.findUserById = async (id) => {
    const [result] = await jawsdb.query("SELECT * FROM user WHERE id = ?", [id]);
    return result[0];
};

exports.findUsersBySearch = async (searchTerm) => {
    return await jawsdb.query("SELECT * FROM user WHERE (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?) && status != 'Deleted'", ["%" + searchTerm + "%", "%" + searchTerm + "%", "%" + searchTerm + "%"]);
}

exports.findAllUsersNotDeleted = async () => {
    return await jawsdb.query("SELECT * FROM user WHERE status != 'Deleted'");
}

// Create user
exports.addUser = async (first_name, last_name, email, password, token, member_since) => {
    const [result] = await jawsdb.query(
        "INSERT INTO user (first_name, last_name, email, password, token, member_since) VALUES (?,?,?,?,?,?)", [first_name, last_name, email, password, token, member_since]
    );
    return result.insertId;
};


// Update user | Note: This is not ideal, as it forces specific data column references. However, it is versatile.
exports.setUserDataById = async (data, id) => {
    await jawsdb.query("UPDATE user SET ? WHERE id = ?", [data, id])
    const [updatedRows] = await jawsdb.query("SELECT * FROM user WHERE id = ?", [id]);
    return updatedRows[0];
}

exports.activateUserByEmail = async (email) => {
    return await jawsdb.query("UPDATE user SET status = 'Active' WHERE email = ?", [email])
}

exports.activateUserById = async (id) => {
    return await jawsdb.query("UPDATE user SET token = ?, status = 'Active' WHERE id = ?", [null, id])
}

// Delete user
exports.deleteAllUsers = async () => {
    return await jawsdb.query("DELETE FROM user")
}

exports.deleteUserById = async (id) => {
    await jawsdb.query("UPDATE user SET email = ?, status = ? WHERE id = ?", [null, "Deleted", id])
    const [updatedRows] = await jawsdb.query("SELECT * FROM user WHERE id = ?", [id]);
    return updatedRows[0];
}
