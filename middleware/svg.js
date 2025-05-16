const path = require('path');

module.exports = (app) => {
    app.use('/svg/home', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/svg/home.svg'), {
            headers: { 'Content-Type': 'image/svg+xml' },
        });
    });
};