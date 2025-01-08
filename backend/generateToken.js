const jwt = require('jsonwebtoken');
require('dotenv').config();

function generateToken(userId) {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15s' });
    console.log('Generated Token:', token);
}
const userId = 'exampleUserId'; 
generateToken(userId);
