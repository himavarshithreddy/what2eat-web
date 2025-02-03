

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductForm from './ProductForm';
import HealthScore from './HealthScore';
import Json from './Json';
import './App.css';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductForm />} />
        <Route path="/health-score" element={<HealthScore />} />
        <Route path="/json" element={<Json />} />
      </Routes>
    </Router>
  );
};

export default App;
