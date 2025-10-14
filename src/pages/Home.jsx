import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { Link } from 'react-router-dom';
import { School, LocalLibrary, Speed } from '@mui/icons-material';
import { getHeroImage } from '../utils/placeholders';

const Home = () => {
  const features = [
    {
      icon: <LocalLibrary sx={{ fontSize: 40 }} />,
      title: 'Wide Book Selection',
      description: 'Access textbooks and academic materials for all departments'
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'Fast Order Processing',
      description: 'Quick order confirmation and ready-for-pickup notifications'
    },
    {
      icon: <School sx={{ fontSize: 40 }} />,
      title: 'Student Focused',
      description: 'Designed specifically for YabaTech students with matric number integration'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #10813dff 0%, #10813dff 100%)',
          color: 'white',
          py: 8,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                YabaTech Bookstore
              </Typography>
              <Typography variant="h5" gutterBottom sx={{ mb: 3, opacity: 0.9 }}>
                Your one-stop platform for academic books and materials
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem' }}>
                Browse, order, and manage your textbooks with ease. 
                Designed specifically for Yaba College of Technology students.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  to="/books"
                  sx={{
                    backgroundColor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'grey.100'
                    }
                  }}
                >
                  Browse Books
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  to="/register"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Get Started
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={getHeroImage()}
                alt="Library"
                sx={{
                  width: '100%',
                  borderRadius: 2,
                  boxShadow: 3
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Why Choose Our Bookstore?
        </Typography>
        <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
          We make accessing academic materials simple and convenient
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                sx={{ 
                  textAlign: 'center', 
                  p: 3,
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          backgroundColor: 'grey.50',
          py: 8,
          borderTop: 1,
          borderBottom: 1,
          borderColor: 'grey.200'
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to Get Your Books?
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
            Join thousands of YabaTech students using our platform
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/register"
            sx={{ px: 4, py: 1.5 }}
          >
            Create Your Account
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;