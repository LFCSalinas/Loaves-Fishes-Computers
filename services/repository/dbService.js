// Database Service - Decoupled Database Queries
import jawsdb from '../../server/database/jawsdb.js'
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
export const addUser = async (username, password, email, role, v_id) => {
    const [result] = await jawsdb.query(
        "INSERT INTO user (username, password, email, role, volunteer_id) VALUES (?,?,?,?,?)", [username, password, email, role, v_id]
    );
    return result.insertId;
};

// Update User
export const updateUserById = async (username, password, email, role, v_id, id) => {
    await jawsdb.query("UPDATE user SET username = ?, password = ?, email = ?, role = ?, volunteer_id = ? WHERE user_id = ?", [username, password, email, role, v_id, id])
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
export const linkVolunteer = async (user_id, volunteer_id) => {
    return await jawsdb.query("UPDATE user SET volunteer_id = ? WHERE user_id = ?", [volunteer_id, user_id])
}