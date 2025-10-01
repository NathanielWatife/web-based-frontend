import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useCart } from '../../../contexts/CartContext';
import './Header.css';


const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { getCartItemsCount } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <div className="logo">
                        <Link to="/">
                            <h1>Yaba College BookShop</h1>
                        </Link>
                    </div>
                    <nav className="nav">
                        <Link to="/books" className="nav-link">Books</Link>
                        {isAuthenticated ? (
                            <>
                                <Link to="/cart" className="nav-link cart-link">
                                    Cart ({getCartItemsCount()})
                                </Link>
                                <Link to="/cart" className="nav-link cart-link">
                                    🛒 Cart ({getCartItemsCount()})
                                </Link>
                                <div className="user-name">
                                    <span>Hello, {user?.first_name}</span>
                                    <div className="dropdown">
                                        <Link to="/profile">Profile</Link>
                                        <Link to="/orders">Orders</Link>
                                        {user?.role === 'admin' && (
                                            <Link to="/admin">Admin</Link>
                                        )}
                                        <button onClick={handleLogout}>LogOut</button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="auth-links">
                                <Link to="/login" className="nav-link">Login</Link>
                                <Link to="/register" className="btn btn-primary">Register</Link>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;