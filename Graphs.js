import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { Box, Typography } from '@mui/material';

function Graph() {
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    // Fetch product data from the backend
    axios
      .get('/api/products/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        // Map data for the chart
        const formattedData = response.data.map((product) => ({
          name: product.name,
          inventory: product.inventory_count,
        }));
        setProductData(formattedData);
      })
      .catch((error) => {
        console.error('Error fetching product data:', error);
      });
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Inventory Count Chart
      </Typography>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={productData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="inventory" fill="#1976d2" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default Graph;
    import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import axios from 'axios';
import { Box, Typography, Grid } from '@mui/material';

function Graph() {
  const [productData, setProductData] = useState([]);
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    // Fetch product data for inventory and price trends
    axios
      .get('/api/products/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        const formattedData = response.data.map((product) => ({
          name: product.name,
          inventory: product.inventory_count,
          price: product.price,
        }));
        setProductData(formattedData);
      })
      .catch((error) => {
        console.error('Error fetching product data:', error);
      });

    // Fetch order data for trends
    axios
      .get('/api/orders/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((response) => {
        const formattedOrderData = response.data.map((order) => ({
          date: order.date,
          quantity: order.total_quantity,
        }));
        setOrderData(formattedOrderData);
      })
      .catch((error) => {
        console.error('Error fetching order data:', error);
      });
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Inventory and Order Trends
      </Typography>

      <Grid container spacing={4}>
        {/* Inventory Count Chart */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Inventory Count by Product
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="inventory" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>

        {/* Product Price Trends */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Product Price Trends
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="price" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

        {/* Orders Over Time */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Orders Over Time
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={orderData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="quantity" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Graph;
