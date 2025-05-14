const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

router.post('/', (req, res) => {
    const { username, password } = req.body;
    
    const usersData = fs.readFileSync(path.join(__dirname, '../users.json'));
    const users = JSON.parse(usersData);

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
            req.session.userId = user.id;
            req.session.cookie.maxAge = 600000;
            req.session.save();
            res.redirect('/home');
            return;
        } else {
            res.render('index', { error: 'Invalid password' });
        }
    });
});

module.exports = router;