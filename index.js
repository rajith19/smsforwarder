const express = require('express');
const cors = require('cors');

const app = express();

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON request body
app.use(express.json({
    strict: true, // Ensures strict parsing of JSON
}));

// Middleware to sanitize inputs
app.use((req, res, next) => {
    if (req.body.sender && req.body.body) {
        req.body.sender = req.body.sender.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
        req.body.body = req.body.body.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
    }
    next();
});

// Middleware to log all incoming requests
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`, req.body);
    next();
});

// Root endpoint for health check
app.get('/', (req, res) => {
    console.log('Health check request received');
    res.status(200).send('Server is running');
});

// Endpoint to handle SMS forwarding
app.post('/forward-sms', (req, res) => {
    const { sender, body } = req.body;

    // Validate sender and body
    if (!sender || !body) {
        console.error('Invalid request data:', req.body);
        return res.status(400).send('Invalid request data');
    }

    console.log('SMS received for forwarding:', { sender, body });
    res.status(200).send('SMS forwarded successfully');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error encountered:', err.message);
    res.status(500).send('Internal Server Error');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
