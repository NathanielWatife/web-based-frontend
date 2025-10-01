import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>Yaba College Bookshop</h3>
                        <p>Your trusted source for academic materials and textbooks.</p>
                    </div>
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="/books">Browse Books</a></li>
                            <li><a href="/about">About Us</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Contact Info</h4>
                        <p>Yaba College of Technology</p>
                        <p>Yaba, Lagos, Nigeria</p>
                        <p>Email: bookshop@yabatech.edu.ng</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 Yaba College Bookshop. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;