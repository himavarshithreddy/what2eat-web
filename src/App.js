

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductForm from './ProductForm';
import HealthScore from './HealthScore';
import './App.css';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductForm />} />
        <Route path="/health-score" element={<HealthScore />} />
      </Routes>
    </Router>
  );
};

export default App;
