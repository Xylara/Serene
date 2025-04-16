const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const bcrypt = require('bcryptjs'); // You'll need to install this package

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/register', (req, res) => {
    res.render('register', { error: null });
});

app.get('/', (req, res) => {
    res.render('index', { error: null });
});

app.post('/register', async (req, res) => {
    const { username, password, confirm_password } = req.body;
    const usersFilePath = path.join(__dirname, 'users.json');
    
    let users = [];
    if (fs.existsSync(usersFilePath)) {
        const fileData = fs.readFileSync(usersFilePath, 'utf-8');
        users = JSON.parse(fileData);
    }

    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        res.render('register', { error: 'Username already exists' });
        return;
    }

    if (password !== confirm_password) {
        res.render('register', { error: 'Passwords do not match' });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
        id: users.length,
        username,
        password: hashedPassword,
        created_at: new Date().toISOString()
    };

    users.push(newUser);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});