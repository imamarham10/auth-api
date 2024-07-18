const express = require('express');
const User = require('../model/User');
const protect = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
