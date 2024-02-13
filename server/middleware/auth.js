import jwt from 'jsonwebtoken';

// Middleware function to authenticate and authorize JWT token
const authToken = (requiredRoles = []) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (token == null) {
            return res.sendStatus(401); // Unauthorized: No token provided
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.sendStatus(403); // Forbidden: Invalid token
            }

            // Attach decoded token to request
            req.user = decoded;

            // Proceed if the user is an admin or if the userId in the token matches the userId parameter in the route
            const isOwner = req.params.id === decoded.sub.toString(); // Assuming 'sub' in token payload is the userId
            const isAdmin = requiredRoles.includes(decoded.role) && decoded.role === 'admin';

            if (isOwner || isAdmin) {
                next(); // User is either the owner or an admin, proceed to the next middleware or route handler
            } else {
                return res.status(403).json({ error: 'Access denied' }); // Forbidden: User doesn't have the right
            }
        });
    };
};
export default authToken;