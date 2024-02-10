import * as dbService from "../../services/dbService.js";
import jwt from 'jsonwebtoken';

// Middleware function to authenticate and verify JWT token
const authToken = (req, res, next) => {
    // Get the token from the authorization header
    // Format of header is "Authorization: Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token

    // If there's no token, return an error
    if (token == null) return res.sendStatus(401); // Unauthorized

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden - token is no longer valid
        // If verification is successful, attach the user to the request object
        req.user = user;

        // Pass control to the next middleware function
        next();
    });
};

export default authToken;