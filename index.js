const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { secretKey } = require('./config/secret');
require('dotenv').config();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const register = require('./routes/register');
const login = require('./routes/login');
const logout = require('./routes/logout');

const svg = require('./middleware/svg');

const isLoggedIn = (req, res, next) => {
    const token = req.cookies['auth-token'];
    if (!token) return res.redirect('/');
    
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.redirect('/');
        req.userId = decoded.userId;
        next();
    });
};

app.get('/', (req, res) => {
    res.render('index', { error: null });
});

app.get('/home', isLoggedIn, (req, res) => {
    res.render('home', { pathname: req.pathname });
});

app.use('/login', login);
app.use('/register', register);
app.use('/logout', logout);

svg(app);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('index', { error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port https://localhost:${PORT}`);
});