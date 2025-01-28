// src/components/HealthScore.js
import { calculateNutriScore } from './firebase';
import React, { useState } from 'react';

const HealthScore = () => {
  const [healthScore, setHealthScore] = useState(null);
  const [error, setError] = useState(null);

  // State to store user input for nutrition data
  const [nutritionData, setNutritionData] = useState({
    energy: '',
    sugars: '',
    saturatedFat: '',
    sodium: '',
    fiber: '',
    protein: '',
    fruitsVegPercentage: '',
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNutritionData({
      ...nutritionData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state

    // Convert input values to numbers
    const data = {
      energy: parseFloat(nutritionData.energy),
      sugars: parseFloat(nutritionData.sugars),
      saturatedFat: parseFloat(nutritionData.saturatedFat),
      sodium: parseFloat(nutritionData.sodium),
      fiber: parseFloat(nutritionData.fiber),
      protein: parseFloat(nutritionData.protein),
      fruitsVegetablesNuts: parseFloat(nutritionData.fruitsVegPercentage),
    };

    // Call the Firebase function
    try {
      const result = await calculateNutriScore(data);
      setHealthScore(result.data.healthScore);
    } catch (err) {
      setError('Error calculating Nutri-Score: ' + err.message);
    }
  };

  return (
    <div>
      <h2>Health Score Calculator</h2>

      {/* Input form */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Energy (kJ):</label>
          <input
            type="number"
            name="energy"
            value={nutritionData.energy}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Sugars (g):</label>
          <input
            type="number"
            name="sugars"
            value={nutritionData.sugars}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Saturated Fat (g):</label>
          <input
            type="number"
            name="saturatedFat"
            value={nutritionData.saturatedFat}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Sodium (mg):</label>
          <input
            type="number"
            name="sodium"
            value={nutritionData.sodium}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Fiber (g):</label>
          <input
            type="number"
            name="fiber"
            value={nutritionData.fiber}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Protein (g):</label>
          <input
            type="number"
            name="protein"
            value={nutritionData.protein}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Fruits & Veg Percentage (%):</label>
          <input
            type="number"
            name="fruitsVegPercentage"
            value={nutritionData.fruitsVegPercentage}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit">Calculate Nutri-Score</button>
      </form>

      {/* Display results */}
      {healthScore !== null && <h3>Nutri-Score: {healthScore}</h3>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default HealthScore;