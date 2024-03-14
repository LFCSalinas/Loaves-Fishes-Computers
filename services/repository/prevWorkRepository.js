import jawsdb from '../../server/database/jawsdb.js'
import 'dotenv/config.js';

export const findPrevWork= async (v_id) => {
    const [result] = await jawsdb.query(
        "SELECT job.job_id, company, title, years, duties FROM previous_work JOIN job ON previous_work.job_id = job.job_id WHERE previous_work.volunteer_id = ?", [v_id]);
    return result;
}

export const createPrevWork = async (j_id, v_id) => {
    const [result] = await jawsdb.query(
        "INSERT INTO previous_work (job_id, volunteer_id) VALUES (?,?)", [j_id, v_id]
    );
    return result.insertId;
}
