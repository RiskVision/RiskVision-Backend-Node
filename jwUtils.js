const jwt = require('jsonwebtoken')

const generateToken = (payload) =>{
    const secretKey = 'riskytohavehere'
    const options = {
        expiresIn: '1h',
    };

    const token = jwt.sign(payload,secretKey,options);
    return token;
}
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const secretKey = 'riskytohavehere'; // Use the same secret key as in token generation
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // Add the decoded user info to the request object
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token.' });
    }
};

module.exports = {
    generateToken,
    authenticateToken
};