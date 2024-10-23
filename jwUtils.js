const jwt = require('jsonwebtoken')

const generateToken = (payload) =>{
    const secretKey = 'riskytohavehere'
    const options = {
        expiresIn: '1h',
    };

    const token = jwt.sign(payload,secretKey,options);
    return token;
}

module.exports = {
    generateToken,
};