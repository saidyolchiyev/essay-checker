const express = require('express');
const cors = require('cors');
const essayRoutes = require('./routes/essay.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/essay', essayRoutes);

module.exports = app;