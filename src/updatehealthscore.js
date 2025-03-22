// src/components/ProductProcessor.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase'; // Adjust the import path as needed

// Configure these as needed
const FUNCTION_URL = 'https://calculatehealthscore-ujjjq2ceua-uc.a.run.app'; // Your cloud function URL
const PROCESSING_DELAY = 10000; // Delay between each call in milliseconds (10 seconds)

const ProductProcessor = () => {
  const [productIds, setProductIds] = useState([]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [successCount, setSuccessCount] = useState(0);
  const [isStarted, setIsStarted] = useState(false); // Track if processing has started
  const [countdown, setCountdown] = useState(0);

  // Custom delay function with countdown timer update
  const customDelay = (ms) => {
    const totalSeconds = ms / 1000;
    return new Promise((resolve) => {
      let secondsLeft = totalSeconds;
      setCountdown(secondsLeft);
      const interval = setInterval(() => {
        secondsLeft -= 1;
        setCountdown(secondsLeft);
        if (secondsLeft <= 0) {
          clearInterval(interval);
          resolve();
        }
      }, 1000);
    });
  };

  // Fetch product IDs and data from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const products = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        console.log('Fetched products:', products);
        setProductIds(products);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Error fetching products: ' + err.message);
      }
    };

    fetchProducts();
  }, []);

  // Handle starting the processing
  const handleStartProcessing = async () => {
    if (productIds.length === 0) {
      setError('No products found to process.');
      return;
    }
    setIsStarted(true);
    setProcessing(true);

    const processProducts = async () => {
      for (const product of productIds) {
        const { id, data } = product;

        try {
          // Prepare nutrition data from Firestore
          const nutrition = data.nutritionInfo.reduce((acc, nutrient) => {
            // Adjust field access if needed (e.g., normalized field names)
            acc[nutrient.name.replace(/ /g, '')] = nutrient.value + (nutrient.unit || '');
            return acc;
          }, {});

          // Extract isBeverage (default to 0 if not present)
          const isBeverage = data.isBeverage || 0;

          // Store the old health score for logging
          const oldHealthScore = data.healthScore || 0;

          // Construct payload
          const payload = {
            nutrition: {
              energy: nutrition.energy || '0kcal',
              sugars: nutrition.sugars || '0g',
              saturatedFat: nutrition.saturatedfat || '0g', // Adjust according to your DB field
              sodium: nutrition.sodium || '0mg',
              fiber: nutrition.fiber || '0g',
              protein: nutrition.protein || '0g',
              fruitsVegetablesNuts: nutrition.fruitsVegetablesNuts || '0',
            },
            isBeverage,
          };

          console.log(`Sending payload for product ${id}:`, payload);

          // Send POST request to the health score API
          const response = await fetch(FUNCTION_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          console.log(`API response for ${id}:`, result);

          // Update healthScore in Firestore
          const productRef = doc(db, 'products', id);
          await updateDoc(productRef, { healthScore: result.healthScore });

          // Log the update to console
          console.log(
            `Successfully updated product ${id}: Old Health Score = ${oldHealthScore}, New Health Score = ${result.healthScore}`
          );

          setResults((prevResults) => [
            ...prevResults,
            {
              productId: id,
              response: result,
              updated: true,
              oldHealthScore: oldHealthScore,
              newHealthScore: result.healthScore,
            },
          ]);
          setSuccessCount((prevCount) => prevCount + 1);
        } catch (err) {
          console.error(`Error processing product ${id}:`, err.message);
          setResults((prevResults) => [
            ...prevResults,
            { productId: id, error: err.message },
          ]);
        }

        // Wait for the specified delay with a countdown timer update before processing the next product
        await customDelay(PROCESSING_DELAY);
      }
      setProcessing(false);
      setCountdown(0);
    };

    processProducts();
  };

  return (
    <div>
      <h2>Processing Product Health Scores</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Successful updates: {successCount} / {productIds.length}</p>
      {!isStarted && (
        <button onClick={handleStartProcessing} disabled={processing}>
          Start Processing
        </button>
      )}
      {processing && (
        <div>
          <p>Processing products... Please wait.</p>
          <p>Next update in: {countdown} second{countdown === 1 ? '' : 's'}</p>
        </div>
      )}
      <div>
        {results.length > 0 && (
          <div>
            <h3>Update Summary</h3>
            {results.map((res, index) => (
              <div key={index} style={{ marginBottom: '1rem' }}>
                <strong>Product ID:</strong> {res.productId}
                {res.response ? (
                  <div>
                    <span style={{ color: 'green', marginLeft: '10px' }}>✓</span>
                    <span style={{ marginLeft: '5px' }}>
                      Old Health Score: {res.oldHealthScore} → New Health Score: {res.newHealthScore} (Successfully updated)
                    </span>
                  </div>
                ) : (
                  <p style={{ color: 'red' }}>Error: {res.error}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductProcessor;
