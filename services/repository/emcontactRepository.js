import jawsdb from '../../server/database/jawsdb.js'
import 'dotenv/config.js';


// Get
export const findContactById = async (id) => {
    const [result] = await jawsdb.query("SELECT * FROM em_contact WHERE em_contact_id = ?", [id]);
    return result[0];
}

// Create
export const addContact = async (first_name, last_name, phone, relation) => {
    const [result] = await jawsdb.query(
        "INSERT INTO em_contact (first_name, last_name, phone, relation) VALUES (?,?,?, ?)", [first_name, last_name, phone, relation]
    );
    return result.insertId;
};

// Update
export const updateContactById = async (first_name, last_name, phone, relation, id) => {
    await jawsdb.query("UPDATE em_contact SET first_name = ?, last_name = ?, phone = ?, relation = ? WHERE em_contact_id = ?", [first_name, last_name, phone, relation, id])
}

// Delete
export const deleteContactById = async (id) => {
    await jawsdb.query("DELETE FROM em_contact WHERE em_contact_id = ?", [id])
}

