import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-glow"></div>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span>🥬</span>
              <span>Fresh<span style={{ color: 'var(--primary)', fontWeight: 900 }}>Things</span><span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Only</span></span>
            </Link>
            <p className="footer-tagline">Your trusted partner for fresh, quality groceries delivered to your doorstep.</p>
            <div className="footer-socials">
              <a href="#facebook" className="social-btn" aria-label="Facebook" id="footer-facebook">📘</a>
              <a href="#instagram" className="social-btn" aria-label="Instagram" id="footer-instagram">📸</a>
              <a href="#twitter" className="social-btn" aria-label="Twitter" id="footer-twitter">🐦</a>
              <a href="#whatsapp" className="social-btn" aria-label="WhatsApp" id="footer-whatsapp">💬</a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/" id="footer-home-link">Home</Link></li>
              <li><Link to="/products" id="footer-products-link">All Products</Link></li>
              <li><Link to="/products?category=fruits-vegetables" id="footer-fruits-link">Fruits & Vegetables</Link></li>
              <li><Link to="/products?category=dairy-eggs" id="footer-dairy-link">Dairy & Eggs</Link></li>
              <li><Link to="/products?badge=Organic" id="footer-organic-link">Organic Products</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Account</h4>
            <ul>
              <li><Link to="/login" id="footer-login-link">Login</Link></li>
              <li><Link to="/register" id="footer-register-link">Register</Link></li>
              <li><Link to="/orders" id="footer-orders-link">My Orders</Link></li>
              <li><Link to="/profile" id="footer-profile-link">My Profile</Link></li>
              <li><Link to="/cart" id="footer-cart-link">My Cart</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contact Us</h4>
            <div className="contact-item">
              <span>📍</span>
              <span>123 Fresh Market Road, Mumbai, 400001</span>
            </div>
            <div className="contact-item">
              <span>📞</span>
              <a href="tel:+911800123456" id="footer-phone">1800-123-456</a>
            </div>
            <div className="contact-item">
              <span>✉️</span>
              <a href="mailto:hello@freshthingsonly.com" id="footer-email">hello@freshthingsonly.com</a>
            </div>
            <div className="contact-item">
              <span>🕐</span>
              <span>Mon–Sun: 6 AM – 10 PM</span>
            </div>
            <div className="app-download">
              <p>Download our app:</p>
              <div className="app-btns">
                <a href="#appstore" className="app-btn" id="footer-appstore">🍎 App Store</a>
                <a href="#playstore" className="app-btn" id="footer-playstore">🤖 Play Store</a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p>© 2025 FreshThingsOnly. All rights reserved.</p>
          </div>
          <div className="footer-bottom-right">
            <a href="#privacy" id="footer-privacy">Privacy Policy</a>
            <a href="#terms" id="footer-terms">Terms of Service</a>
            <a href="#refund" id="footer-refund">Refund Policy</a>
          </div>
          <div className="payment-icons">
            <span title="Visa">💳</span>
            <span title="Mastercard">💳</span>
            <span title="UPI">📱</span>
            <span title="Cash on Delivery">💵</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
