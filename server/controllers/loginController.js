import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import * as dbService from "../../services/repository/dbService.js";
import * as volunteerRepository from "../../services/repository/volunteerRepository.js";

export const login = async (req, res) => {
    // Generate new token upon login
    try {
        // Get credentials
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }

        // Check credentials against repository
        const user = await dbService.findUserByUsername(username);
        if (!user) {
            return res.sendStatus(401);
        }
        const match = await bcrypt.compare(password, user.password.toString()); // Assuming password is stored as Buffer in DB
        if (!match) {
            return res.sendStatus(401);
        }

        // Append Volunteer Data if exists:
        let v
        if (user.volunteer_id) {
            v = await volunteerRepository.findVolunteerById(user.volunteer_id)
            console.log("Found Volunteer", v)
        }

        const payload = {
            sub:user.user_id, vid:v.volunteer_id, aid:v.address_id, cid:v.em_contact_id , role:user.role
        }

        // Sign new token
        const jwtToken = await jwt.sign(payload,  process.env.JWT_SECRET, { expiresIn: '1h' });
        res.setHeader('Access-Control-Expose-Headers', 'Authorization');
        res.setHeader('Authorization', `Bearer ${jwtToken}`);
        return res.send({ authenticated: true, user_id: user.user_id });

    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
};

export const jwtLogin = async (req, res) => {
    const userId = req.user.sub; // Get the user id
    res.json({ id: userId});
}
