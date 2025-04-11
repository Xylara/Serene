const path = require('path');

module.exports = (app) => {
    app.use('/css/main.css', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/assets/css/main.css'), {
            headers: { 'Content-Type': 'text/css' },
        });
    });

    app.use('/js/main.js', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/assets/js/main.js'), {
            headers: { 'Content-Type': 'application/javascript' },
        });
    });
};