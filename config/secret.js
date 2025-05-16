require('dotenv').config();

const secretConfig = {
    secretKey: process.env.SECRET_KEY,
    tokenExpiresIn: '10m',
    tokenMaxAge: 600000
};

module.exports = secretConfig;