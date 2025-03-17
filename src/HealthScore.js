// src/components/HealthScore.js
import React, { useState } from 'react';

const HealthScore = () => {
  const [healthScore, setHealthScore] = useState(null);
  const [error, setError] = useState(null);
  const [isBeverage, setIsBeverage] = useState(0); // 0 for food, 1 for beverage

  // State for nutrition data with values and units
  const [nutritionData, setNutritionData] = useState({
    energy: { value: '', unit: 'kcal' },
    sugars: { value: '', unit: 'g' },
    saturatedFat: { value: '', unit: 'g' },
    sodium: { value: '', unit: 'mg' },
    fiber: { value: '', unit: 'g' },
    protein: { value: '', unit: 'g' },
    fruitsVegetablesNuts: { value: '', unit: '%' },
  });

  // Handle changes to nutrition inputs (value or unit)
  const handleInputChange = (e, field) => {
    const { name, value } = e.target;
    setNutritionData({
      ...nutritionData,
      [field]: { ...nutritionData[field], [name]: value },
    });
  };

  // Handle form submission and API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    // Validate that all fields are filled
    const isValid = Object.values(nutritionData).every(
      (nutrient) => nutrient.value.trim() !== ''
    );
    if (!isValid) {
      setError('Please fill in all nutrition fields.');
      return;
    }

    // Construct payload with units included
    const payload = {
      nutrition: {
        energy: nutritionData.energy.value + nutritionData.energy.unit,
        sugars: nutritionData.sugars.value + nutritionData.sugars.unit,
        saturatedFat: nutritionData.saturatedFat.value + nutritionData.saturatedFat.unit,
        sodium: nutritionData.sodium.value + nutritionData.sodium.unit,
        fiber: nutritionData.fiber.value + nutritionData.fiber.unit,
        protein: nutritionData.protein.value + nutritionData.protein.unit,
        fruitsVegetablesNuts: nutritionData.fruitsVegetablesNuts.value, // Percentage, no unit needed in value
      },
      isBeverage: isBeverage,
    };

    // Make direct API call
    try {
      const response = await fetch('https://calculatehealthscore-ujjjq2ceua-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch health score');
      }

      const data = await response.json();
      setHealthScore(data.healthScore.toString());
    } catch (err) {
      setError('Failed to calculate health score. Please check your inputs and try again.');
    }
  };

  return (
    <div>
      <h2>Health Score Calculator</h2>

      {/* Form for user input */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Product Type:</label>
          <select
            value={isBeverage}
            onChange={(e) => setIsBeverage(parseInt(e.target.value))}
          >
            <option value={0}>Food</option>
            <option value={1}>Beverage</option>
          </select>
        </div>

        <div>
          <label>Energy:</label>
          <input
            type="number"
            name="value"
            value={nutritionData.energy.value}
            onChange={(e) => handleInputChange(e, 'energy')}
            required
          />
          <select
            name="unit"
            value={nutritionData.energy.unit}
            onChange={(e) => handleInputChange(e, 'energy')}
          >
            <option value="kcal">kcal</option>
            <option value="kJ">kJ</option>
          </select>
        </div>

        <div>
          <label>Sugars (g):</label>
          <input
            type="number"
            name="value"
            value={nutritionData.sugars.value}
            onChange={(e) => handleInputChange(e, 'sugars')}
            required
          />
          <select
            name="unit"
            value={nutritionData.sugars.unit}
            onChange={(e) => handleInputChange(e, 'sugars')}
          >
            <option value="g">g</option>
          </select>
        </div>

        <div>
          <label>Saturated Fat (g):</label>
          <input
            type="number"
            name="value"
            value={nutritionData.saturatedFat.value}
            onChange={(e) => handleInputChange(e, 'saturatedFat')}
            required
          />
          <select
            name="unit"
            value={nutritionData.saturatedFat.unit}
            onChange={(e) => handleInputChange(e, 'saturatedFat')}
          >
            <option value="g">g</option>
          </select>
        </div>

        <div>
          <label>Sodium (mg):</label>
          <input
            type="number"
            name="value"
            value={nutritionData.sodium.value}
            onChange={(e) => handleInputChange(e, 'sodium')}
            required
          />
          <select
            name="unit"
            value={nutritionData.sodium.unit}
            onChange={(e) => handleInputChange(e, 'sodium')}
          >
            <option value="mg">mg</option>
          </select>
        </div>

        <div>
          <label>Fiber (g):</label>
          <input
            type="number"
            name="value"
            value={nutritionData.fiber.value}
            onChange={(e) => handleInputChange(e, 'fiber')}
            required
          />
          <select
            name="unit"
            value={nutritionData.fiber.unit}
            onChange={(e) => handleInputChange(e, 'fiber')}
          >
            <option value="g">g</option>
          </select>
        </div>

        <div>
          <label>Protein (g):</label>
          <input
            type="number"
            name="value"
            value={nutritionData.protein.value}
            onChange={(e) => handleInputChange(e, 'protein')}
            required
          />
          <select
            name="unit"
            value={nutritionData.protein.unit}
            onChange={(e) => handleInputChange(e, 'protein')}
          >
            <option value="g">g</option>
          </select>
        </div>

        <div>
          <label>Fruits, Vegetables, Nuts (%):</label>
          <input
            type="number"
            name="value"
            value={nutritionData.fruitsVegetablesNuts.value}
            onChange={(e) => handleInputChange(e, 'fruitsVegetablesNuts')}
            required
          />
          <select
            name="unit"
            value={nutritionData.fruitsVegetablesNuts.unit}
            onChange={(e) => handleInputChange(e, 'fruitsVegetablesNuts')}
          >
            <option value="%">%</option>
          </select>
        </div>

        <button type="submit">Calculate Health Score</button>
      </form>

      {/* Display results or errors */}
      {healthScore !== null && <h3>Health Score: {healthScore}</h3>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default HealthScore;