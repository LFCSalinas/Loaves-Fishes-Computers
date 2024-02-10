import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import * as dbService from "../../services/dbService.js";

export const login = async (req, res) => {
    try {
        const secret = process.env.JWT_SECRET;
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }

        const user = await dbService.findUserByUsername(username);
        if (!user) {
            return res.sendStatus(401);
        }

        const match = await bcrypt.compare(password, user.password.toString()); // Assuming password is stored as Buffer in DB
        if (!match) {
            return res.sendStatus(401);
        }

        const token = await jwt.sign({ username: username }, secret, { expiresIn: '1h' });
        return res.json({ token: token, username: username });
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
};

export const verified = async (req,res) => {
    return res.json(req.user)
}