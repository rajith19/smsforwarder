const express = require('express');
const app = express();

// Middleware to parse JSON request body
app.use(express.json());
const cors = require('cors');
app.use(cors());

// Middleware to sanitize inputs
app.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.url, req.body);
    if (req.body.sender && req.body.body) {
        req.body.sender = req.body.sender.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
        req.body.body = req.body.body.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
    }
    next();
});

app.get('/', (req, res) => {
    console.log('Request received:', req.body);
    const { sender, body } = req.body;
    res.status(200).send('SMS');
});

app.post('/forward-sms', (req, res) => {
    console.log('Request received:', req.body);
    const { sender, body } = req.body;
    res.status(200).send('SMS forwarded successfully');
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
