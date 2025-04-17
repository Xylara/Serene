const express = require('express');
const router = express.Router();
const fs = require('fs');
const bcrypt = require('bcryptjs');
const path = require('path');

const usersData = fs.readFileSync(path.join(__dirname, '../users.json'));
const users = JSON.parse(usersData);

router.post('/', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(user => user.username === username);
    
    if (!user) {
        res.render('index', { error: 'Username not found' });
        return;
    }

    bcrypt.compare(password, user.password, (err, match) => {
        if (err) {
            console.error(err);
            res.render('index', { error: 'An error occurred' });
        }
        if (match) {
            res.send('Login successful!');
        } else {
            res.render('index', { error: 'Invalid password' });
        }
    });
});

module.exports = router;