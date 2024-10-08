const axios = require('axios');
const Transaction = require('../Models/Transaction');

// Initialize the database with seed data
const initializeDatabase = async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;

    console.log("response data comming from database",response)
    await Transaction.deleteMany({});
    const processedTransactions = transactions.map(transaction => {
      const dateOfSale = new Date(transaction.dateOfSale);
      transaction.dateOfSale = dateOfSale;
      return transaction;
    }).filter(transaction => !isNaN(transaction.dateOfSale.getTime()));

    await Transaction.insertMany(processedTransactions);
    res.status(200).json({ message: 'Database initialized with seed data' });
  } catch (error) {
    console.error('Error initializing database:', error.message);
    res.status(500).json({ error: 'Error initializing the database' });
  }
};

// List transactions with pagination and search
// List transactions with pagination and search
const listTransactions = async (req, res) => {
  const { month, search = '', page = 1, perPage = 10 } = req.query;

  console.log("Received query object from frontend:", req.query);

  // Create the start and end dates based on the month
  const startDate = new Date(`2021-${month}-01`);
  const endDate = new Date(`2023-${month}-31`);

  // Build the query object
  const query = {
    dateOfSale: { $gte: startDate, $lte: endDate }, // Filter by date range
    $or: [
      { title: new RegExp(search, 'i') },  // Case-insensitive search in title
      { description: new RegExp(search, 'i') },  // Case-insensitive search in description
    ],
  };

  // If search is numeric, add a price search
  if (!isNaN(search) && search !== '') {
    query.$or.push({ price: Number(search) });
  }

  // Log the final query object
  console.log("MongoDB query object:", query);

  try {
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(Number(perPage));

    // Log the fetched transactions for debugging
    console.log("Transactions fetched from MongoDB:", transactions);

    const totalTransactions = await Transaction.countDocuments(query);
    
    console.log("total transactions",totalTransactions)
    res.json({ transactions, totalTransactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Error fetching transactions' });
  }
};


// Get statistics for selected month
const getStatistics = async (req, res) => {
  const { month } = req.query;

  if (!month || month < 1 || month > 12) {
    return res.status(400).json({ error: 'Invalid month parameter' });
  }

  const startDate = new Date(`2023-${month}-01`);
  const endDate = new Date(`2023-${month}-31`);

  try {
    const transactions = await Transaction.find({
      dateOfSale: { $gte: startDate, $lte: endDate },
    });

    const totalSale = transactions.reduce((sum, t) => (t.sold ? sum + t.price : sum), 0);
    const soldItems = transactions.filter(t => t.sold).length;
    const notSoldItems = transactions.filter(t => !t.sold).length;

    res.json({ totalSale, soldItems, notSoldItems });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Error fetching statistics' });
  }
};

// Get bar chart data for selected month
const getBarChart = async (req, res) => {
  const { month } = req.query;

  console.log('Received month:', month); // Log the incoming request

  if (!month || month < 1 || month > 12) {
    return res.status(400).json({ error: 'Invalid month parameter' });
  }

  const startDate = new Date(`2023-${month}-01`);
  const endDate = new Date(`2023-${month}-31`);

  try {
    const transactions = await Transaction.find({
      dateOfSale: { $gte: startDate, $lte: endDate },
    });

    console.log('Fetched transactions:', transactions); // Log fetched transactions

    const priceRanges = {
      '0-100': 0,
      '101-200': 0,
      '201-300': 0,
      '301-400': 0,
      '401-500': 0,
      '501-600': 0,
      '601-700': 0,
      '701-800': 0,
      '801-900': 0,
      '901-above': 0,
    };

    transactions.forEach(t => {
      if (t.price <= 100) priceRanges['0-100']++;
      else if (t.price <= 200) priceRanges['101-200']++;
      else if (t.price <= 300) priceRanges['201-300']++;
      else if (t.price <= 400) priceRanges['301-400']++;
      else if (t.price <= 500) priceRanges['401-500']++;
      else if (t.price <= 600) priceRanges['501-600']++;
      else if (t.price <= 700) priceRanges['601-700']++;
      else if (t.price <= 800) priceRanges['701-800']++;
      else if (t.price <= 900) priceRanges['801-900']++;
      else priceRanges['901-above']++;
    });

    res.json(priceRanges);
  } catch (error) {
    console.error('Error fetching bar chart data:', error);
    res.status(500).json({ error: 'Error fetching bar chart data' });
  }
};


// Get pie chart data for selected month
const getPieChart = async (req, res) => {
  const { month } = req.query;

  if (!month || month < 1 || month > 12) {
    return res.status(400).json({ error: 'Invalid month parameter' });
  }

  const startDate = new Date(`2023-${month}-01`);
  const endDate = new Date(`2023-${month}-31`);

  try {
    const categories = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    res.json(categories);
  } catch (error) {
    console.error('Error fetching pie chart data:', error);
    res.status(500).json({ error: 'Error fetching pie chart data' });
  }
};

// Combine data from all APIs
const getCombinedData = async (req, res) => {
  const { month } = req.query;

  if (!month || month < 1 || month > 12) {
    return res.status(400).json({ error: 'Invalid month parameter' });
  }

  try {
    const statistics = await getStatistics(req, res);
    const barChart = await getBarChart(req, res);
    const pieChart = await getPieChart(req, res);

    res.json({ statistics, barChart, pieChart });
  } catch (error) {
    console.error('Error combining data:', error);
    res.status(500).json({ error: 'Error combining data' });
  }
};

module.exports = {
  initializeDatabase,
  listTransactions,
  getStatistics,
  getBarChart,
  getPieChart,
  getCombinedData,
};
