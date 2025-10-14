import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Badge, 
  IconButton,
  Box
} from '@mui/material';
import { ShoppingCart, Person, ExitToApp, Dashboard } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#10813dff' }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/"
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'inherit',
            fontWeight: 'bold'
          }}
        >
          YabaTech Bookstore
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/books"
          >
            Books
          </Button>

          {user ? (
            <>
              <IconButton 
                color="inherit" 
                component={Link} 
                to="/cart"
              >
                <Badge badgeContent={getCartItemsCount()} color="secondary">
                  <ShoppingCart />
                </Badge>
              </IconButton>

              {isAdmin && (
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/admin"
                  startIcon={<Dashboard />}
                >
                  Admin
                </Button>
              )}

              <Button 
                color="inherit" 
                component={Link} 
                to="/profile"
                startIcon={<Person />}
              >
                Profile
              </Button>

              <Button 
                color="inherit" 
                onClick={handleLogout}
                startIcon={<ExitToApp />}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                component={Link} 
                to="/login"
              >
                Login
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/register"
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;