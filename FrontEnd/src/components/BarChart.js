import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const BarChart = ({ selectedMonth }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBarChartData();
  }, [selectedMonth]);

  const fetchBarChartData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/bar-chart', {
        params: { month: selectedMonth },
      });

      const priceRanges = response.data;

      // Ensure priceRanges is defined and has data before setting state
      if (priceRanges && Object.keys(priceRanges).length > 0) {
        setData({
          labels: Object.keys(priceRanges),
          datasets: [
            {
              label: 'Number of Items',
              data: Object.values(priceRanges),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
          ],
        });
      } else {
        // Handle the case where the API returns no data
        setData({
          labels: [],
          datasets: [],
        });
      }
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Ensure there is valid data before rendering the chart
  return loading ? (
    <p>Loading Bar Chart...</p>
  ) : data.labels && data.labels.length > 0 ? (
    <Bar data={data} />
  ) : (
    <p>No data available for the selected month.</p>
  );
};

export default BarChart;
