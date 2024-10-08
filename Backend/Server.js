require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
// const cors = require('cors');
const transactionRoutes = require('./routes/TransactionsRoutes');

const app = express();
const cors = require('cors');

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from the frontend
}));

app.use(express.json());

app.use('/api', transactionRoutes);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
