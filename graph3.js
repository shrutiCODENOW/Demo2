import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Card,
  CardHeader,
  CardContent,
  Grid,
  LineChart,
  Line
} from '@mui/material';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

function Graphs() {
  const [logs, setLogs] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [categoryName, setCategoryName]= useState('');
  const [barData, setBarData]= useState(true);
  const[stockTrends, setStockTrends] = useState('');

  useEffect(() => {
    // Fetching logs data
    axios
      .get('http://127.0.0.1:8198/inventory-log/')
      .then((response) => setLogs(response.data))
      .catch((error) => console.error(error));

    // Fetching product data for the chart
    const fetchProductData = async () => {
      try {
        const token = localStorage.getItem('accessToken'); // Get token from localStorage
        const response = await axios.get('http://127.0.0.1:8198/api/get/user_product/', {
          headers: { Authorization: `Bearer ${token}` }, // Add token in headers for authentication
        });

        const categoryStock = {};
        const productPriceData= [];
        
        // Loop through the products and sum the stock_quantity for each category
        // response.data.forEach((product) => {
        //   if (product.stock_quantity > 0) {
        //     if (categoryStock[product.category]) {
        //       categoryStock[product.category] += product.stock_quantity;
        //     } else {
        //       categoryStock[product.category] = product.stock_quantity;
        //     }
        //   }
        // });
        response.data.forEach((product) => {
          // Filter by category name if it's provided
          if (product.stock_quantity > 0 && (!categoryName || product.category_name === categoryName)) {
            if (categoryStock[product.category_name]) {
              categoryStock[product.category_name] += product.stock_quantity;
            } else {
              categoryStock[product.category_name] = product.stock_quantity;
            }
          }
          productPriceData.push({name:product.name,price:product.price});
        });

        // Transforming the aggregated data for Pie Chart
        const chartData = Object.keys(categoryStock).map((category) => ({
          name: category,               // Category name
          value: categoryStock[category], // Total stock quantity in that category
        }));

       

        setChartData(chartData); // Set the chart data
        setBarData(productPriceData);
        
      } catch (error) {
        console.error('Failed to fetch product data:', error);
      } finally {
        setLoading(false); // Stop loading once the data is fetched
      }
    };

    fetchProductData(); // Call the function to fetch product data
  }, []);

  const handleProfileMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Display loading spinner while data is being fetched
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // If no chart data is available
  if (!chartData.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6" color="error">
          Failed to load chart data.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar />
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
          Graphs
        </Typography>

      {/* Graphs Content */}
      <Box sx={{ p: 3, mt: 2 , display:'flex', gap:3}}>
        

      

<Card sx={{ boxShadow: 3, borderRadius: 2, mb: 3, width:'50%'}}>
          <CardHeader title="Category vs Stock Quantity (Pie Chart)" />
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name" // Ensure nameKey is set to 'name', which contains category_name
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
          </CardContent>
        </Card>

        <Card sx={{ boxShadow: 3, borderRadius: 2 ,width:'50%' }}>
              <CardHeader title="Product vs Price (Bar Chart)" />
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="price" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
        
      </Box>
    </Box>
  );
}


// Function to generate a color for each slice of the pie chart
const getColor = (index) => {
  const colors = ['#FF8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  return colors[index % colors.length];
};

export default Graphs;

          
  
This is my graph.js file in this code add another api for fetching stock trend over time and create a line graph for it and this 
is my backend code for stock trend over time
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_stock_trends(request):
    # Group by date (assuming there is a `updated_at` field in Product)
    stock_trend = (
        Product.objects
        .annotate(date=TruncDate('updated_at'))  # Truncate to just date
        .values('date')
        .annotate(total_stock=Sum('stock_quantity'))
        .order_by('date')
    )

    # Format response data
    data = [
        {"date": entry["date"].strftime("%Y-%m-%d"), "stock_quantity": entry["total_stock"]}
        for entry in stock_trend if entry["date"] is not None
    ]

    return Response(data)
