// Database Service - Decoupled Database Queries
import jawsdb from '../server/repository/jawsdb.js'
import 'dotenv/config.js';


export const findAllUsers = async () => {
    const [results] = await jawsdb.query("SELECT * FROM user")
    return results
}

export const findUserById = async (id) => {
    const [result] = await jawsdb.query("SELECT * FROM user WHERE user_id = ?", [id]);
    return result[0];
};

// Get user(s) given arg
export const findUserByEmail = async (email) => {
    const [result] = await jawsdb.query("SELECT * FROM user WHERE email = ?", [email]);
    return result[0];
}

// Get user(s) given arg
export const findUserByUsername = async (username) => {
    const [result] = await jawsdb.query("SELECT * FROM user WHERE username = ?", [username]);
    return result[0];
}


// Create User
export const addUser = async (username, password, email, role) => {
    const [result] = await jawsdb.query(
        "INSERT INTO user (username, password, email, role) VALUES (?,?,?,?)", [username, password, email, role]
    );
    return result.insertId;
};

// Update User
export const updateUserById = async (username, password, email, role, id) => {
    await jawsdb.query("UPDATE user SET username = ?, password = ?, email = ?, role = ? WHERE user_id = ?", [username, password, email, role, id])
}

// Delete User
export const deleteUserById = async (id) => {
    await jawsdb.query("DELETE FROM user WHERE user_id = ?", [id])
}




export const findUsersBySearch = async (searchTerm) => {
    return await jawsdb.query("SELECT * FROM user WHERE (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?) && status != 'Deleted'", ["%" + searchTerm + "%", "%" + searchTerm + "%", "%" + searchTerm + "%"]);
}

export const findAllUsersNotDeleted = async () => {
    return await jawsdb.query("SELECT * FROM user WHERE status != 'Deleted'");
}




// Update user | Note: This is not ideal, as it forces specific data column references. However, it is versatile.
export const setUserDataById = async (data, id) => {
    await jawsdb.query("UPDATE user SET ? WHERE id = ?", [data, id])
    const [updatedRows] = await jawsdb.query("SELECT * FROM user WHERE id = ?", [id]);
    return updatedRows[0];
}

export const activateUserByEmail = async (email) => {
    return await jawsdb.query("UPDATE user SET status = 'Active' WHERE email = ?", [email])
}

export const activateUserById = async (id) => {
    return await jawsdb.query("UPDATE user SET token = ?, status = 'Active' WHERE id = ?", [null, id])
}

// Delete user
export const deleteAllUsers = async () => {
    return await jawsdb.query("DELETE FROM user")
}



