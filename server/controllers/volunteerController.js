import jwt from 'jsonwebtoken'
import * as dbService from "../../services/dbService.js";

export const register = async (req, res) => {
    try {
        console.log(req.body)

    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
};



