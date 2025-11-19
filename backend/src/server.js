require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./config/database');
const linkRoutes = require('./routes/linkRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', linkRoutes);

// Initialize database and start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});