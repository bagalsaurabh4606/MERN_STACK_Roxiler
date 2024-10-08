const express = require('express');
const router = express.Router();
const {
  initializeDatabase,
  listTransactions,
  getStatistics,
  getBarChart,
  getPieChart,
  getCombinedData,
} = require('../controllers/TransactionsController');

// Initialize database
router.get('/initialize', initializeDatabase);

// List transactions with pagination and search
router.get('/transactions', listTransactions);

// Get statistics for a selected month
router.get('/statistics', getStatistics);

// Get bar chart data for a selected month
router.get('/bar-chart', getBarChart);

// Get pie chart data for a selected month
router.get('/pie-chart', getPieChart);

// Get combined data
router.get('/combined', getCombinedData);

module.exports = router;
