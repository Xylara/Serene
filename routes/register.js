const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const ejs = require('ejs');

router.get('/', (req, res) => {
    res.render('register', { error: null });
});


router.post('/', async (req, res) => {
    const { username, password, confirm_password } = req.body;
    const usersFilePath = path.join(__dirname, '..', 'users.json');
    
    let users = [];
    if (fs.existsSync(usersFilePath)) {
        const fileData = fs.readFileSync(usersFilePath, 'utf-8');
        users = JSON.parse(fileData);
    }

    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        res.render('register', { 
            error: 'Username already taken. Please choose a different username.' 
        });
        return;
    }

    if (password !== confirm_password) {
        res.render('register', { error: 'Passwords do not match' });
        return;
    }

    const hashedPass = await bcrypt.hash(password, 10);
    
    const newUser = {
        id: users.length,
        username,
        password: hashedPass,
        created_at: new Date().toISOString()
    };

    users.push(newUser);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    res.redirect('/');
});

module.exports = router;