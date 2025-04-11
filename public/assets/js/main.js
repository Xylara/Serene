document.addEventListener('DOMContentLoaded', () => {
    const chatElement = document.getElementById('chat');
    const messageElement = document.getElementById('message');
    const sendButton = document.getElementById('send');
    const usernameElement = document.getElementById('username');

    function displayMessage(user, text, timestamp) {
        const messageDiv = document.createElement('div');
        messageDiv.innerHTML = `<strong>${user} (${new Date(timestamp).toLocaleTimeString()}):</strong> ${text}`;
        chatElement.appendChild(messageDiv);
        chatElement.scrollTop = chatElement.scrollHeight;
    }

    const socket = new WebSocket(`ws://localhost:${window.location.port}`);

    socket.onmessage = event => {
        const msg = JSON.parse(event.data);
        displayMessage(msg.user, msg.text, msg.timestamp);
    };

    sendButton.addEventListener('click', () => {
        const user = usernameElement.value.trim();
        const text = messageElement.value.trim();
        if (user && text) {
            fetch('/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user, text }),
            })
            .then(response => response.json())
            .then(msg => {
                messageElement.value = '';
            })
            .catch(error => console.error('Error sending message:', error));
        }
    });
});