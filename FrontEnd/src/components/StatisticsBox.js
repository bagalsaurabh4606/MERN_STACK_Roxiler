import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StatisticsBox = ({ selectedMonth }) => {
  const [statistics, setStatistics] = useState({ totalSale: 0, soldItems: 0, notSoldItems: 0 });

  useEffect(() => {
    fetchStatistics();
  }, [selectedMonth]);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/statistics', {
        params: { month: selectedMonth },
      });
      console.log("statastic data",response)
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  return (
    <div>
      <h3>Statistics for {selectedMonth}</h3>
      <p>Total Sale Amount: {statistics.totalSale}</p>
      <p>Sold Items: {statistics.soldItems}</p>
      <p>Not Sold Items: {statistics.notSoldItems}</p>
    </div>
  );
};

export default StatisticsBox;
