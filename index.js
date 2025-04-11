const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/api');
const staticMiddleware = require('./middleware/static');

const app = express();
const port = 3002;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
staticMiddleware(app);

app.get('/', (req, res) => {
    res.render('index');
});


app.use('/api', apiRoutes);

app.listen(port, () => {
    console.log(`Serene is running on http://localhost:${port}`);
});