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

    function fetchMessages() {
        fetch('/api/messages')
            .then(response => response.json())
            .then(data => {
                chatElement.innerHTML = '';
                data.forEach(msg => displayMessage(msg.user, msg.text, msg.timestamp));
            })
            .catch(error => console.error('Error fetching messages:', error));
    }

    setInterval(fetchMessages, 2000);

    sendButton.addEventListener('click', () => {
        const user = usernameElement.value.trim();
        const text = messageElement.value.trim();
        if (user && text) {
            fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user, text }),
            })
            .then(response => response.json())
            .then(msg => {
                messageElement.value = '';
                fetchMessages();
            })
            .catch(error => console.error('Error sending message:', error));
        }
    });

    fetchMessages();
});