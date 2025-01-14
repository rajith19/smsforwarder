const express = require('express');
const app = express();
const cors = require('cors');

// In-memory storage for forwarded SMS
let forwardedSmsLog = [];

// Middleware to enable CORS and parse JSON
app.use(cors());
app.use(express.json());

// Middleware to sanitize inputs
app.use((req, res, next) => {
    if (req.body.sender && req.body.body) {
        req.body.sender = req.body.sender.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
        req.body.body = req.body.body.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
    }
    next();
});

// Route to handle incoming SMS (POST)
app.post('/forward-sms', (req, res) => {
    console.log('Request received:', req.body);

    const { sender, body } = req.body;

    if (!sender || !body) {
        return res.status(400).send('Invalid request: sender and body are required.');
    }

    // Add the forwarded SMS to the log
    forwardedSmsLog.push({ sender, body, timestamp: new Date().toISOString() });

    console.log(`SMS forwarded successfully: Sender: ${sender}, Body: ${body}`);
    res.status(200).send('SMS forwarded successfully');
});

// Route to retrieve forwarded SMS logs (GET)
app.get('/forwarded-sms', (req, res) => {
    res.status(200).json({
        success: true,
        data: forwardedSmsLog,
    });
});

// Route to clear logs (optional for testing purposes)
app.delete('/clear-sms', (req, res) => {
    forwardedSmsLog = [];
    res.status(200).send('Forwarded SMS logs cleared.');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
