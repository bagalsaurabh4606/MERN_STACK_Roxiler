import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ selectedMonth }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPieChartData();
  }, [selectedMonth]);

  const fetchPieChartData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/pie-chart', {
        params: { month: selectedMonth },
      });

      const categories = response.data;

      // Ensure categories is defined and has data before setting state
      if (categories && categories.length > 0) {
        setData({
          labels: categories.map(cat => cat._id),
          datasets: [
            {
              label: 'Categories',
              data: categories.map(cat => cat.count),
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
              ],
            },
          ],
        });
      } else {
        setData({
          labels: [],
          datasets: [],
        });
      }
    } catch (error) {
      console.error('Error fetching pie chart data:', error);
    } finally {
      setLoading(false);
    }
  };


  return loading ? (
    <p>Loading Pie Chart...</p>
  ) : data.labels && data.labels.length > 0 ? (
    <Pie data={data} />
  ) : (
    <p>No data available for the selected month.</p>
  );
};

export default PieChart;
