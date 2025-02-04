import React, { useState } from 'react';
import { db, setDoc, doc } from './firebase'; // Import setDoc and doc

const Json = () => {
  const [jsonFile, setJsonFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle JSON file selection
  const handleJsonChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/json") {
      setJsonFile(file);
    } else {
      alert("Please select a valid JSON file.");
      setJsonFile(null);
    }
  };

  // Handle JSON file upload and save to Firestore
  const handleJsonUpload = async () => {
    if (!jsonFile) {
      alert("Please select a JSON file first!");
      return;
    }

    setLoading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);

        if (!Array.isArray(jsonData)) {
          alert("JSON should be an array of objects.");
          return;
        }

        for (const item of jsonData) {
          // Create a document ID from Ingredientname
          const docId = item.IngredientName.replace(/\s+/g, '').toLowerCase(); // Trim spaces and lowercase
          const docRef = doc(db, "ingredients", docId); // Reference to the document with custom ID

          // Set the document with the custom ID
          await setDoc(docRef, item);
        }

        alert("JSON data uploaded successfully to Firestore!");
        setJsonFile(null);
      } catch (error) {
        console.error("Error uploading JSON:", error);
        alert("Invalid JSON format or Firestore error!");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsText(jsonFile);
  };

  return (
    <div className="App">
      <h1>Upload JSON to Firestore</h1>
      <input type="file" accept=".json" onChange={handleJsonChange} />
      <button onClick={handleJsonUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload JSON"}
      </button>
      {jsonFile && <p>Selected file: {jsonFile.name}</p>}
    </div>
  );
};

export default Json;