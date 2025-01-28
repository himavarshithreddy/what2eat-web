import React, { useState } from 'react';
import { db, addDoc, collection, storage} from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom'; 
import './App.css';

const ProductForm = () => {
  const [barcode, setBarcode] = useState('');
  const [name, setName] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [nutritionInfo, setNutritionInfo] = useState({
    energy: '',
    fats: '',
    sugars: '',
    protein: '',
    sodium: '',
    carbohydrates: '',
    vitaminB: '',
    iron: '',
    fiber: '',
    fruitsVegetablesNuts: ''
  });
  const [userRating, setUserRating] = useState('');
  const [numberOfRatings, setNumberOfRatings] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [healthScore, setHealthScore] = useState('');
  const [image, setImage] = useState(null);
  const [customFields, setCustomFields] = useState([]);
  const [customFieldName, setCustomFieldName] = useState('');
  const [customFieldType, setCustomFieldType] = useState('');
  const [customNutritionFields, setCustomNutritionFields] = useState([]);

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  // Handle adding new custom fields
  const handleAddCustomField = () => {
    if (customFieldName && customFieldType) {
      setCustomFields([
        ...customFields,
        { name: customFieldName, type: customFieldType }
      ]);
      setCustomFieldName('');
      setCustomFieldType('');
    }
  };

  // Handle adding new custom fields to nutritionInfo
  const handleAddCustomNutritionField = () => {
    if (customFieldName && customFieldType) {
      setCustomNutritionFields([
        ...customNutritionFields,
        { name: customFieldName, type: customFieldType }
      ]);
      setCustomFieldName('');
      setCustomFieldType('');
    }
  };

  // Parse custom fields based on their types
  const parseFieldValue = (value, type) => {
    switch (type) {
      case 'integer':
        return parseInt(value);
      case 'float':
        return parseFloat(value);
      case 'array':
        return value.split(',').map((v) => v.trim());
      case 'string':
      default:
        return value;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload image to Firebase Storage
    let imageUrl = '';
    if (image) {
      const storageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(storageRef, image);
      imageUrl = await getDownloadURL(storageRef);
    }

    // Add custom fields to the product object
    const customFieldsData = {};
    customFields.forEach((field) => {
      const fieldValue = document.getElementById(`custom-${field.name}`).value;
      customFieldsData[field.name] = parseFieldValue(fieldValue, field.type);
    });

    // Add custom fields to the nutritionInfo object
    const customNutritionData = {};
    customNutritionFields.forEach((field) => {
      const fieldValue = document.getElementById(`nutrition-${field.name}`).value;
      customNutritionData[field.name] = parseFieldValue(fieldValue, field.type);
    });

    const productData = {
      barcode,
      name,
      imageURL: imageUrl,
      ingredients: ingredients.split(',').map((ingredient) => ingredient.trim()),
      nutritionInfo: {
        ...nutritionInfo,
        ...customNutritionData // Add custom fields to nutritionInfo
      },
      userRating: parseFloat(userRating),
      numberOfRatings: parseInt(numberOfRatings),
      categoryId,
      pros: pros.split(',').map((pro) => pro.trim()),
      cons: cons.split(',').map((con) => con.trim()),
      healthScore: parseInt(healthScore),
      ...customFieldsData // Add custom fields to the product object
    };

    try {
      const docRef = await addDoc(collection(db, 'products'), productData);
      alert('Product added successfully!');
      // Clear the form after submission
      setBarcode('');
      setName('');
      setImageURL('');
      setIngredients('');
      setNutritionInfo({
        energy: '',
        fats: '',
        sugars: '',
        protein: '',
        sodium: '',
        carbohydrates: '',
        vitaminB: '',
        iron: '',
        fiber: '',
        fruitsVegetablesNuts: ''
      });
      setUserRating('');
      setNumberOfRatings('');
      setCategoryId('');
      setPros('');
      setCons('');
      setHealthScore('');
      setImage(null);
      setCustomFields([]);
      setCustomNutritionFields([]);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <div className="App">
      <Link to="/health-score" style={buttonStyle}>
        Test Health Score
      </Link>
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Barcode"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <input
          type="text"
          placeholder="Ingredients (comma separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          required
        />
        {Object.keys(nutritionInfo).map((key) => (
          <input
            key={key}
            type="text"
            placeholder={key}
            value={nutritionInfo[key]}
            onChange={(e) =>
              setNutritionInfo({ ...nutritionInfo, [key]: e.target.value })
            }
          />
        ))}
        <input
          type="text"
          placeholder="User Rating"
          value={userRating}
          onChange={(e) => setUserRating(e.target.value)}
        />
        <input
          type="text"
          placeholder="Number of Ratings"
          value={numberOfRatings}
          onChange={(e) => setNumberOfRatings(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category ID"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Pros (comma separated)"
          value={pros}
          onChange={(e) => setPros(e.target.value)}
        />
        <input
          type="text"
          placeholder="Cons (comma separated)"
          value={cons}
          onChange={(e) => setCons(e.target.value)}
        />
        <input
          type="text"
          placeholder="Health Score"
          value={healthScore}
          onChange={(e) => setHealthScore(e.target.value)}
        />

        <h2>Custom Fields</h2>
        {customFields.map((field) => (
          <input
            key={field.name}
            id={`custom-${field.name}`}
            type="text"
            placeholder={`${field.name} (${field.type})`}
          />
        ))}
        <h2>Custom Nutrition Info Fields</h2>
        {customNutritionFields.map((field) => (
          <input
            key={field.name}
            id={`nutrition-${field.name}`}
            type="text"
            placeholder={`${field.name} (${field.type})`}
          />
        ))}
        <input
          type="text"
          placeholder="Field Name"
          value={customFieldName}
          onChange={(e) => setCustomFieldName(e.target.value)}
        />
        <select
          value={customFieldType}
          onChange={(e) => setCustomFieldType(e.target.value)}
        >
          <option value="">Select Type</option>
          <option value="string">String</option>
          <option value="integer">Integer</option>
          <option value="float">Float</option>
          <option value="array">Array</option>
        </select>
        <button type="button" onClick={handleAddCustomField}>
          Add Custom Field
        </button>
        <button type="button" onClick={handleAddCustomNutritionField}>
          Add Nutrition Info Field
        </button>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};
const buttonStyle = {
  position: 'absolute',
  top: '20px',
  right: '20px',
  padding: '10px 20px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  textDecoration: 'none',
};
export default ProductForm;
