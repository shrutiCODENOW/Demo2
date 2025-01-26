import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Grid, Paper } from '@mui/material';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Logged in successfully!'); // Replace with API call later
    navigate('/dashboard'); // Placeholder for now
  };

  return (
    <Grid 
      container 
      component="main" 
      sx={{ height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          maxWidth: 400,
          width: '90%',
          textAlign: 'center',
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            variant="outlined"
            margin="normal"
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            margin="normal"
            onChange={handleChange}
            required
          />
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate('/')}
            >
              Go to Register Page
            </Button>
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
};

export default Login;

 path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
