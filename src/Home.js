// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-wrapper">
      <header className="home-hero">
        <h1 className="home-title">What2Eat</h1>
        <p className="home-subtitle">Discover healthier food choices with ease</p>
        <Link to="/product-form" className="hero-cta">
          Get Started
        </Link>
      </header>

      <section className="home-features">
        <h2 className="features-title">Explore What2Eat</h2>
        <div className="features-grid">
          <Link to="/product-form" className="feature-card">
            <h3>Add a Product</h3>
            <p>Submit a new food or beverage to analyze its nutritional value.</p>
          </Link>
          <Link to="/health-score" className="feature-card">
            <h3>Calculate Health Score</h3>
            <p>Evaluate the healthiness of your food with our scoring system.</p>
          </Link>
          <Link to="/json" className="feature-card">
            <h3>View JSON Data</h3>
            <p>Access raw data for your products in JSON format.</p>
          </Link>
          <Link to="/update" className="feature-card">
            <h3>Update Barcodes</h3>
            <p>Modify barcodes for existing products in your database.</p>
          </Link>
          <Link to="/download" className="feature-card">
            <h3>Download Collection</h3>
            <p>Export your product data for offline use.</p>
          </Link>
          <Link to="/updatehealthscore" className="feature-card">
            <h3>Update Health Scores</h3>
            <p>Recalculate health scores for all products.</p>
          </Link>
        </div>
      </section>

      <footer className="home-footer">
        <p>&copy; 2025 What2Eat. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-conditions">Terms & Conditions</Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;