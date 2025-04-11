const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const messagesFilePath = path.join(__dirname, '../messages.json');

let messages = [];
if (fs.existsSync(messagesFilePath)) {
    const fileData = fs.readFileSync(messagesFilePath, 'utf-8');
    messages = JSON.parse(fileData);
}

router.get('/messages', (req, res) => {
    res.json(messages);
});

router.post('/messages', (req, res) => {
    const { user, text } = req.body;
    if (!user || !text) {
        return res.status(400).json({ error: 'User and text are required' });
    }
    const newMessage = {
        id: messages.length,
        user,
        text,
        timestamp: new Date().toISOString(),
    };
    messages.push(newMessage);

    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2), 'utf-8');

    res.status(201).json(newMessage);
});

module.exports = router;