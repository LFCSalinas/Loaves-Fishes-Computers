import jwt from 'jsonwebtoken';

// Middleware function to authenticate and authorize JWT token
const authToken = (authEntity, requiredRoles = []) => {
    return (req, res, next) => {
        const stack = req.route.stack
        console.log("=================================================")
        console.log(`Authorization for ${stack[stack.length-1].name}`)
        console.log("Params:", req.params);
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        console.log("Token:", authHeader);
        if (token == null) {
            console.log("No Token:");
            return res.sendStatus(401); // Unauthorized: No token provided
        }
        console.log(`JWT: ${token}`)

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error(err)
                return res.sendStatus(403); // Forbidden: Invalid token
            }
            console.log("Payload", decoded)

            req.user = decoded;

            // Proceed if the user is an admin or if the userId in the token matches the userId parameter in the route
            const isRole = requiredRoles.includes(decoded.role)

            let isOwner = false
            if (req.params.id) {
                switch (authEntity) {
                    case 'USER':
                        isOwner = req.params.id === decoded.sub.toString()
                        break;
                    case 'VOLUNTEER':
                        isOwner = req.params.id === decoded.vid.toString()
                        break;
                    case 'CONTACT':
                        isOwner = req.params.id === decoded.cid.toString()
                        break;
                    case 'ADDRESS':
                        isOwner = req.params.id === decoded.aid.toString()
                        break;
                }
            }

            // Assuming 'sub' in token payload is the userId
            const isAdmin = decoded.role === 'ADMIN';
            const state = (isRole || isOwner || isAdmin)

            console.log(`Role-Match:${isRole} | Self-Edit:${isOwner} | Admin:${isAdmin} | ${state ? 'Accepted' : 'Rejected' }` )
            if (state) {
                next(); // User is either the owner or an admin, proceed to the next middleware or route handler
            } else {
                return res.status(403).json({ error: 'Access denied' }); // Forbidden: User doesn't have the right
            }
        });
    };
};
export default authToken;