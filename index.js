const express = require('express');
const app = express();
const port = 3002;
const WebSocket = require('ws');
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let messages = [];
let clients = [];

app.get('/', (req, res) => {
    res.render('index');
});

app.get("/css/main.css", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/assets/css/main.css"), { headers: { 'Content-Type': 'text/css' } });
});

app.get("/js/main.js", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/assets/js/main.js"), { headers: { 'Content-Type': 'application/javascript' } });
});

app.post('/send-message', (req, res) => {
    const { user, text } = req.body;
    const newMessage = {
        id: messages.length,
        user,
        text,
        timestamp: new Date().toISOString(),
    };
    messages.push(newMessage);

    clients.forEach(ws => ws.send(JSON.stringify(newMessage)));

    res.status(201).json(newMessage);
});

const server = app.listen(port, () => {
    console.log(`Serene is on http://localhost:${port}`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
    clients.push(ws);

    messages.forEach(msg => ws.send(JSON.stringify(msg)));

    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
    });
});