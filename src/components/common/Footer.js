import React from 'react';
import '../../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>YabaTech BookStore</h3>
            <p>Your trusted partner for academic materials and resources.</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/books">Book Catalog</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact Info</h4>
            <p>Yaba College of Technology</p>
            <p>Lagos, Nigeria</p>
            <p>Email: bookstore@yabatech.edu.ng</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 YabaTech BookStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;