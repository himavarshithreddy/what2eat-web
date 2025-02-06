import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // Adjust the import path as needed

// Configure these as needed
const FUNCTION_URL = 'https://calculatehealthscore-ujjjq2ceua-uc.a.run.app'; // Your cloud function URL
const PROCESSING_DELAY = 2000; // Delay between each call in milliseconds (2 seconds)

const ProductProcessor = () => {
  const [productIds, setProductIds] = useState([]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [successCount, setSuccessCount] = useState(0);

  // Utility function to create a delay
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  // Fetch product IDs from Firestore
  useEffect(() => {
    const fetchProductIds = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const ids = querySnapshot.docs.map(doc => doc.id);
        console.log('Fetched product IDs:', ids);
        setProductIds(ids);
      } catch (err) {
        console.error('Error fetching product IDs:', err);
        setError('Error fetching product IDs: ' + err.message);
      }
    };

    fetchProductIds();
  }, []);

  // Process each product ID sequentially with a delay
  useEffect(() => {
    if (productIds.length > 0 && !processing) {
      setProcessing(true);

      const processIds = async () => {
        for (const id of productIds) {
          try {
            // Send POST request with one product ID
            const response = await fetch(FUNCTION_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ productId: id })
            });
            const data = await response.json();
            console.log(`Response for ${id}:`, data);
            setResults(prevResults => [...prevResults, { productId: id, response: data }]);

            // Increase the success counter if the response doesn't contain an error.
            // You might need to adjust this condition based on your Cloud Function response structure.
            if (response.ok && !data.error) {
              setSuccessCount(prevCount => prevCount + 1);
            }
          } catch (err) {
            console.error(`Error processing ${id}:`, err);
            setResults(prevResults => [
              ...prevResults,
              { productId: id, error: err.message }
            ]);
          }
          // Wait for the specified delay before processing the next product ID
          await delay(PROCESSING_DELAY);
        }
        setProcessing(false);
      };

      processIds();
    }
  }, [productIds, processing]);

  return (
    <div>
      <h2>Processing Product IDs</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Successful edits: {successCount}</p>
      {processing && <p>Processing product IDs... Please wait.</p>}
      <div>
        {results.map((res, index) => (
          <div key={index} style={{ marginBottom: '1rem' }}>
            <strong>Product ID:</strong> {res.productId}
            {res.response ? (
              <pre>{JSON.stringify(res.response, null, 2)}</pre>
            ) : (
              <p style={{ color: 'red' }}>Error: {res.error}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductProcessor;
