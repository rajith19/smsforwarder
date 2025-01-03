const express = require('express');
const app = express();

// Middleware to parse JSON request body
app.use(express.json());
const cors = require('cors');
app.use(cors());

app.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.url, req.body);
    next();
});

app.get('/', (req, res) => {
    console.log('Request received:', req.body);
    const { sender, body } = req.body;
    res.status(200).send('SMS ');
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
