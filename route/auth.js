const express = require('express');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const router = express.Router();
const queueEmail = require('../config/email');

router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const user = new User({ email, username, password });
    
    await user.save();
  
    queueEmail(user.email, 'Welcome!', 'Thank you for registering.');

    queueEmail(process.env.GMAIL_ID, 'New User Registration', `A new user has registered with the username: ${user.username}`);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
