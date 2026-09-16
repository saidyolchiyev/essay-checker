const express = require('express');
const cors = require('cors');
const essayRoutes = require('./routes/essay.routes');

const app = express();

app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/essay', essayRoutes);

module.exports = app;