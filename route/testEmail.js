const express = require('express');
const sendEmail = require('../config/email');

const router = express.Router();

router.get('/send-test-email', (req, res) => {
  const testEmail = 'arhamimam2000@gmail.com';
  sendEmail(testEmail, 'Test Email', 'This is a test email.');
  res.status(200).send('Test email sent');
});

module.exports = router;
