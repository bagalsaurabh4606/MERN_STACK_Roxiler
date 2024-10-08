import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TransactionsTable = ({ selectedMonth }) => {
  const [transactions, setTransactions] = useState([]); // State to hold transactions
  const [search, setSearch] = useState(''); // State for search input
  const [page, setPage] = useState(1); // State for pagination
  const [perPage] = useState(10); // Number of transactions per page
  const [totalTransactions, setTotalTransactions] = useState(0); // State to hold total transaction count

  // Effect to fetch transactions whenever selectedMonth, search, or page changes
  useEffect(() => {
    fetchTransactions();
  }, [selectedMonth, search, page]);

  // Function to fetch transactions from the backend
  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/transactions', {
        params: {
          month: selectedMonth, // Make sure 'selectedMonth' is defined
          search,
          page,
          perPage,
        },
      });
      console.log("response data", response.data);
      setTransactions(response.data.transactions);
      setTotalTransactions(response.data.totalTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };
  

  console.log("Fetched Transactions:", transactions); // Log the transactions state

  return (
    <div>
      <input
        type="text"
        placeholder="Search transactions"
        value={search} // Bind the input value to the search state
        onChange={(e) => setSearch(e.target.value)} // Update search state on change
      />
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Date of Sale</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {/* Placeholder for pagination controls */}
        {/* You can add logic here to display pagination buttons */}
        <p>Total Transactions: {totalTransactions}</p> {/* Display total transactions */}
      </div>
    </div>
  );
};

export default TransactionsTable;
