import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Typography, CircularProgress } from '@mui/material';

const CategoryStockPieChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        // Fetching products data from the backend API
        const token = localStorage.getItem('accessToken'); // Get token from localStorage
        const response = await axios.get('http://127.0.0.1:8000/api/products/', {
          headers: { Authorization: `Bearer ${token}` }, // Add token in headers for authentication
        });

        // Aggregating stock quantities by category
        const categoryStock = {};
        response.data.forEach((product) => {
          // Only considering products that have stock > 0
          if (product.stock_quantity > 0) {
            if (categoryStock[product.category]) {
              categoryStock[product.category] += product.stock_quantity;
            } else {
              categoryStock[product.category] = product.stock_quantity;
            }
          }
        });

        // Transforming the aggregated data to be used in the Pie Chart
        const chartData = Object.keys(categoryStock).map((category) => ({
          name: category,               // Category name
          value: categoryStock[category], // Total stock quantity in that category
        }));

        setChartData(chartData); // Set the chart data
      } catch (error) {
        console.error('Failed to fetch product data:', error); // Handle errors
      } finally {
        setLoading(false); // Stop loading once the data is fetched
      }
    };

    fetchProductData(); // Call the function to fetch product data on component mount
  }, []);

  // Display loading spinner while data is being fetched
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // If no chart data is available
  if (!chartData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6" color="error">
          Failed to load chart data.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Category vs Stock Quantity
      </Typography>

      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={150}
            fill="#8884d8"
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(index)} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

// Function to generate a color for each slice of the pie chart
const getColor = (index) => {
  const colors = ['#FF8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  return colors[index % colors.length];
};

export default CategoryStockPieChart;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, Legend as BarLegend, ResponsiveContainer as BarResponsiveContainer } from 'recharts';
import { Box, Typography, CircularProgress, Grid } from '@mui/material';

const StockGraphs = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const token = localStorage.getItem('accessToken'); // Get token from localStorage
        const response = await axios.get('http://127.0.0.1:8000/api/products/', {
          headers: { Authorization: `Bearer ${token}` }, // Add token in headers for authentication
        });

        const categoryStock = {};
        response.data.forEach((product) => {
          // Only considering products that have stock > 0
          if (product.stock_quantity > 0) {
            if (categoryStock[product.category]) {
              categoryStock[product.category] += product.stock_quantity;
            } else {
              categoryStock[product.category] = product.stock_quantity;
            }
          }
        });

        // Transforming the aggregated data to be used in charts
        const chartData = Object.keys(categoryStock).map((category) => ({
          name: category,               // Category name
          value: categoryStock[category], // Total stock quantity in that category
        }));

        setChartData(chartData); // Set the chart data
      } catch (error) {
        console.error('Failed to fetch product data:', error);
      } finally {
        setLoading(false); // Stop loading once the data is fetched
      }
    };

    fetchProductData(); // Call the function to fetch product data on component mount
  }, []);

  // Display loading spinner while data is being fetched
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // If no chart data is available
  if (!chartData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6" color="error">
          Failed to load chart data.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Stock Quantity Analysis
      </Typography>

      <Grid container spacing={3}>
        {/* Pie Chart */}
        <Grid item xs={12} sm={6}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Category vs Stock Quantity (Pie Chart)
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                fill="#8884d8"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(index)} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12} sm={6}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Category vs Stock Quantity (Bar Chart)
          </Typography>
          <BarResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Bar dataKey="value" fill="#8884d8" />
              <BarTooltip />
              <BarLegend />
            </BarChart>
          </BarResponsiveContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

// Function to generate a color for each slice of the pie chart
const getColor = (index) => {
  const colors = ['#FF8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  return colors[index % colors.length];
};

export default StockGraphs;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Typography, CircularProgress } from '@mui/material';

const Graphs = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const token = localStorage.getItem('accessToken'); // Get token from localStorage
        const response = await axios.get('http://127.0.0.1:8000/api/products/', {
          headers: { Authorization: `Bearer ${token}` }, // Add token in headers for authentication
        });

        const categoryStock = {};
        response.data.forEach((product) => {
          // Only considering products that have stock > 0
          if (product.stock_quantity > 0) {
            if (categoryStock[product.category]) {
              categoryStock[product.category] += product.stock_quantity;
            } else {
              categoryStock[product.category] = product.stock_quantity;
            }
          }
        });

        // Transforming the aggregated data to be used in charts
        const chartData = Object.keys(categoryStock).map((category) => ({
          name: category,               // Category name
          value: categoryStock[category], // Total stock quantity in that category
        }));

        setChartData(chartData); // Set the chart data
      } catch (error) {
        console.error('Failed to fetch product data:', error);
      } finally {
        setLoading(false); // Stop loading once the data is fetched
      }
    };

    fetchProductData(); // Call the function to fetch product data on component mount
  }, []);

  // Display loading spinner while data is being fetched
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // If no chart data is available
  if (!chartData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6" color="error">
          Failed to load chart data.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Category vs Stock Quantity (Pie Chart)
      </Typography>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
            fill="#8884d8"
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(index)} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

// Function to generate a color for each slice of the pie chart
const getColor = (index) => {
  const colors = ['#FF8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  return colors[index % colors.length];
};

export default Graphs;
          
  
