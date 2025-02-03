import React, { useState } from 'react';
import { db, addDoc, collection } from './firebase';

const Json = () => {
  const [jsonFile, setJsonFile] = useState(null);

  // Handle JSON file selection
  const handleJsonChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setJsonFile(file);
    }
  };

  // Handle JSON file upload and save to Firestore
  const handleJsonUpload = async () => {
    if (!jsonFile) {
      alert("Please select a JSON file first!");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);

        if (!Array.isArray(jsonData)) {
          alert("JSON should be an array of objects.");
          return;
        }

        const collectionRef = collection(db, "ingredients");

        for (const item of jsonData) {
          await addDoc(collectionRef, item);
        }

        alert("JSON data uploaded successfully to Firestore!");
        setJsonFile(null);
      } catch (error) {
        console.error("Error uploading JSON:", error);
        alert("Invalid JSON format!");
      }
    };

    reader.readAsText(jsonFile);
  };

  return (
    <div className="App">
      <h1>Upload JSON to Firestore</h1>
      <input type="file" accept=".json" onChange={handleJsonChange} />
      <button onClick={handleJsonUpload}>Upload JSON</button>
    </div>
  );
};

export default Json;
