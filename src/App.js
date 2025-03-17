

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductForm from './ProductForm';
import HealthScore from './HealthScore';
import Json from './Json';
import UpdateBarcodes from './updatefiled';
import DownloadCollection from './download';
import ProductProcessor from './updatehealthscore';
import PrivacyPolicy from './privacy-policy';
import TermsAndConditions from './terms-conditions';
import Home from './Home'
import './App.css';
const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/product-form" element={<ProductForm />} />
        <Route path="/health-score" element={<HealthScore />} />
        <Route path="/json" element={<Json />} />
        <Route path="/update" element={<UpdateBarcodes />} />
        <Route path="/download" element={<DownloadCollection />} />
        <Route path="/updatehealthscore" element={<ProductProcessor />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsAndConditions />} />
      </Routes>
    </Router>
  );
};

export default App;
