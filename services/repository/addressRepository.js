import jawsdb from '../../server/database/jawsdb.js'
import 'dotenv/config.js';


// Get
export const findAddressById = async (id) => {
    const [result] = await jawsdb.query("SELECT * FROM address WHERE address_id = ?", [id]);
    return result[0];
}

// Create
export const addAddress = async (street, city, state) => {
    const [result] = await jawsdb.query(
        "INSERT INTO address (street, city, state) VALUES (?,?,?)", [street, city, state]
    );
    return result.insertId;
};

// Update
export const updateAddressById = async (street, city, state, id) => {
    await jawsdb.query("UPDATE address SET street = ?, city = ?, state = ? WHERE address_id = ?", [street, city, state, id])
}

// Delete
export const deleteAddressById = async (id) => {
    await jawsdb.query("DELETE FROM address WHERE address_id = ?", [id])
}

