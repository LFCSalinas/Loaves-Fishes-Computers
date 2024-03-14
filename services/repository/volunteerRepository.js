import jawsdb from '../../server/database/jawsdb.js'
import 'dotenv/config.js';

// Volunteer ====================================
export const addVolunteer = async (volunteerData) => {
    const { first_name, last_name, phone, member_since, birthday, gender, active,
        em_contact_id, address_id, image_filename, form_filename, motivation, skills, languages, place_of_birth
    } = volunteerData;

    const query = `
        INSERT INTO volunteer (
            first_name, last_name, phone, member_since, birthday, gender, active, 
            em_contact_id, address_id, image_filename, form_filename, motivation, 
            skills, languages, place_of_birth
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        first_name, last_name, phone, member_since, birthday, gender, active,
        em_contact_id, address_id, image_filename, form_filename, motivation, skills, languages, place_of_birth
    ];

    const [result] = await jawsdb.query(query, params);
    return result.insertId;
};
export async function updateVolunteerFormById(volunteer_id, filename) {
    return await jawsdb.query("UPDATE volunteer SET form_filename = ? WHERE volunteer_id = ?", [filename, volunteer_id])
}

export const findVolunteerById = async (id) => {
    const [result] = await jawsdb.query("SELECT * FROM volunteer WHERE volunteer_id = ?", [id]);
    return result[0];
};

// Update Volunteer
export const updateVolunteerById = async (volunteer_id, first_name, last_name, phone, member_since, birthday, gender,
                                          active, em_contact_id, address_id, image_filename, form_filename, motivation, skills, languages, place_of_birth) => {

    await jawsdb.query(`
        UPDATE volunteer SET
            first_name = ?, last_name = ?, phone = ?, member_since = ?, birthday = ?, gender = ?, active = ?,
            em_contact_id = ?, address_id = ?, image_filename = ?, form_filename = ?, motivation = ?,
            skills = ?, languages = ?, place_of_birth = ?
        WHERE volunteer_id = ?`, [first_name, last_name, phone, member_since, birthday, gender, active,
        em_contact_id, address_id, image_filename, form_filename, motivation, skills, languages, place_of_birth, volunteer_id])
}

// Delete Volunteer
export const deleteVolunteerById = async (id) => {
    await jawsdb.query("DELETE FROM volunteer WHERE volunteer_id = ?", [id])
}

// Link
export const linkAddress = async (id, a_id) => {
    return await jawsdb.query("UPDATE volunteer SET address_id = ? WHERE volunteer_id = ?", [id, a_id])

}

export const linkContact = async (id, c_id) => {
    return await jawsdb.query("UPDATE volunteer SET em_contact_id = ? WHERE volunteer_id = ?", [id, c_id])

}