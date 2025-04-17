const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');

const register = require('./routes/register');
const login = require('./routes/login');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('index', { error: null });
});

app.use('/login', login);
app.use('/register', register);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port https://localhost:${PORT}`);
});