const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./route/auth');
const adminRoutes = require('./route/admin');
const testEmailRoutes = require('./route/testEmail');
const protect = require('./middleware/auth');
require('dotenv').config();


const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/auth-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/test', testEmailRoutes);

app.get('/api/protected', protect, (req, res) => {
  res.status(200).json({ message: 'This is a protected route', user: req.user });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
