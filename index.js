const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;


const AUTH_TOKEN = process.env.AUTH_TOKEN;
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];

    if (token !== AUTH_TOKEN) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }

    next();
};

// Load user data from JSON
const loadUsers = () => {
    const data = fs.readFileSync('./data/users.json', 'utf-8');
    return JSON.parse(data);
};

// API: Search user by mobile number or msisdn
app.get('/api/user-search', authenticate, (req, res) => {
    const { mobileNumber, msisdn } = req.query;
    const users = loadUsers();

    const user = users.find(u =>
        (mobileNumber && u.mobileNumber === mobileNumber) ||
        (msisdn && u.msisdn === msisdn)
    );

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
});

app.listen(PORT, () => {
    console.log(`User search API running on http://localhost:${PORT}`);
});
