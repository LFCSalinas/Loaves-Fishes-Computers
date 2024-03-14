import jawsdb from '../../server/database/jawsdb.js'
import 'dotenv/config.js';


// Get
export const findJobById = async (id) => {
    const [result] = await jawsdb.query("SELECT * FROM job WHERE job_id = ?", [id]);
    return result[0];
}

// Create
export const addJob = async (company, title, years, duties) => {
    const [result] = await jawsdb.query(
        "INSERT INTO job (company, title, years, duties) VALUES (?,?,?,?)", [company, title, years, duties]
    );
    return result.insertId;
};

// Update
export const updateJobId = async (company, title, years, duties, id) => {
    await jawsdb.query("UPDATE job SET company = ?, title = ?, years = ?, duties = ? WHERE job_id = ?", [company, title, years, duties, id])
}

// Delete
export const deleteJobById = async (id) => {
    await jawsdb.query("DELETE FROM job WHERE job_id = ?", [id])
}

