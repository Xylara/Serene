const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secretKey, tokenExpiresIn, tokenMaxAge  } = require('../config/secret');

router.post('/', (req, res) => {
    const { username, password } = req.body;
    
    fs.readFile(path.join(__dirname, '../users.json'), (err, data) => {
        if (err) {
            console.error(err);
            res.render('index', { error: 'An error occurred' });
            return;
        }
        
        const users = JSON.parse(data);
        const user = users.find(user => user.username === username);
        
        if (!user) {
            res.render('index', { error: 'Username not found' });
            return;
        }

        bcrypt.compare(password, user.password, (err, match) => {
            if (err) {
                console.error(err);
                res.render('index', { error: 'An error occurred' });
                return;
            }
            
            if (match) {
                const token = jwt.sign({
                    userId: user.id
                }, secretKey, {
                    expiresIn: tokenExpiresIn
                });
                
                res.cookie('auth-token', token, {
                    maxAge: tokenMaxAge, 
                    httpOnly: false,
                    secure: true
                });
                
                res.redirect('/home');
                return;
            }
            
            res.render('index', { error: 'Invalid password' });
        });
    });
});

module.exports = router;