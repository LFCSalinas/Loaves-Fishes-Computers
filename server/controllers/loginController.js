import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import * as dbService from "../../services/dbService.js";

export const login = async (req, res) => {
    // Generate new token upon login
    try {
        // Get credentials
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }

        // Check credentials against database
        const user = await dbService.findUserByUsername(username);
        if (!user) {
            return res.sendStatus(401);
        }
        const match = await bcrypt.compare(password, user.password.toString()); // Assuming password is stored as Buffer in DB
        if (!match) {
            return res.sendStatus(401);
        }

        // Sign new token
        const jwtToken = await jwt.sign({ sub:user.user_id, role:user.role },  process.env.JWT_SECRET, { expiresIn: '1h' });

        res.setHeader('Access-Control-Expose-Headers', 'Authorization');
        res.setHeader('Authorization', `Bearer ${jwtToken}`);
        return res.send({ authenticated: true, user_id: user.user_id });

    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
};



