import React, { useState } from 'react';
import { db, addDoc, collection, storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';
import './ProductForm.css'; // We'll create this CSS file

const ProductForm = () => {
  const [barcodes, setBarcodes] = useState('');
  const [name, setName] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [artificialIngredients, setArtificialIngredients] = useState('');
  const [nutritionInfo, setNutritionInfo] = useState({
    energy: { value: '', unit: 'kcal' },
    protein: { value: '', unit: 'g' },
    totalFat: { value: '', unit: 'g' },
    saturatedFat: { value: '', unit: 'g' },
    carbohydrates: { value: '', unit: 'g' },
    fiber: { value: '', unit: 'g' },
    sugars: { value: '', unit: 'g' },
    calcium: { value: '', unit: 'mg' },
    magnesium: { value: '', unit: 'mg' },
    iron: { value: '', unit: 'mg' },
    zinc: { value: '', unit: 'mg' },
    iodine: { value: '', unit: 'mcg' },
    sodium: { value: '', unit: 'mg' },
    potassium: { value: '', unit: 'mg' },
    phosphorus: { value: '', unit: 'mg' },
    copper: { value: '', unit: 'mg' },
    selenium: { value: '', unit: 'mcg' },
    vitaminA: { value: '', unit: 'mcg' },
    vitaminC: { value: '', unit: 'mg' },
    vitaminD: { value: '', unit: 'mcg' },
    vitaminE: { value: '', unit: 'mg' },
    thiamine: { value: '', unit: 'mg' },
    riboflavin: { value: '', unit: 'mg' },
    niacin: { value: '', unit: 'mg' },
    vitaminB6: { value: '', unit: 'mg' },
    folate: { value: '', unit: 'mcg' },
    vitaminB12: { value: '', unit: 'mcg' },
    fruitsVegetablesNuts: { value: '', unit: '%' }
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

  // Nutrient aliases for placeholders
  const nutrientAliases = {
    energy: 'Energy (Calories)',
    protein: 'Protein',
    totalFat: 'Total Fat',
    saturatedFat: 'Saturated Fat',
    carbohydrates: 'Carbohydrates',
    fiber: 'Fiber (Dietary Fiber)',
    sugars: 'Sugars',
    calcium: 'Calcium',
    magnesium: 'Magnesium',
    iron: 'Iron',
    zinc: 'Zinc',
    iodine: 'Iodine',
    sodium: 'Sodium',
    potassium: 'Potassium',
    phosphorus: 'Phosphorus',
    copper: 'Copper',
    selenium: 'Selenium',
    vitaminA: 'Vitamin A',
    vitaminC: 'Vitamin C',
    vitaminD: 'Vitamin D',
    vitaminE: 'Vitamin E',
    thiamine: 'Thiamine (Vitamin B1)',
    riboflavin: 'Riboflavin (Vitamin B2)',
    niacin: 'Niacin (Vitamin B3)',
    vitaminB6: 'Vitamin B6',
    folate: 'Folate (Vitamin B9)',
    vitaminB12: 'Vitamin B12',
    fruitsVegetablesNuts: 'Fruits, Vegetables, Nuts (Percentage)'
  };

  // Unit options for each nutrient
  const unitOptions = {
    energy: ['kcal', 'kJ'],
    protein: ['g', 'mg','mcg'],
    totalFat: ['g', 'mg','mcg'],
    saturatedFat: ['g', 'mg','mcg'],
    carbohydrates: ['g', 'mg','mcg'],
    fiber: ['g', 'mg','mcg'],
    sugars: ['g', 'mg','mcg'],
    calcium: ['mg', 'g','mcg'],
    magnesium: ['mg', 'g','mcg'],
    iron: ['mg', 'g','mcg'],
    zinc: ['mg', 'g','mcg'],
    iodine: ['mcg', 'mg','g'],
    sodium: ['mg', 'g','mcg'],
    potassium: ['mg', 'g','mcg'],
    phosphorus: ['mg', 'g','mcg'],
    copper: ['mg', 'g','mcg'],
    selenium: ['mcg', 'mg','g'],
    vitaminA: ['mcg', 'mg','g'],
    vitaminC: ['mg', 'g','mcg'],
    vitaminD: ['mcg', 'mg','g'],
    vitaminE: ['mg', 'g','mcg'],
    thiamine: ['mg', 'mcg','g'],
    riboflavin: ['mg', 'mcg','g'],
    niacin: ['mg', 'mcg','g'],
    vitaminB6: ['mg', 'mcg','g'],
    folate: ['mcg', 'mg','g'],
    vitaminB12: ['mcg', 'mg','g'],
    fruitsVegetablesNuts: ['%','mcg', 'mg','g']
  };

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
        return value.split(';').map((v) => v.trim());
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

    // Parse barcodes into an array
    const parsedBarcodes = barcodes.split(';').map((barcode) => barcode.trim()).filter(Boolean);

    // Add custom fields to the product object
    const customFieldsData = {};
    customFields.forEach((field) => {
      const fieldValue = document.getElementById(`custom-${field.name}`).value;
      customFieldsData[field.name] = parseFieldValue(fieldValue, field.type);
    });

    // Add custom fields to the nutritionInfo object
    const customNutritionData = [];
    customNutritionFields.forEach((field) => {
      const fieldValue = document.getElementById(`nutrition-${field.name}`).value;
      const fieldUnit = document.getElementById(`nutrition-unit-${field.name}`).value || 'unknown';
      customNutritionData.push({
        name: field.name,
        value: parseFieldValue(fieldValue, field.type),
        unit: fieldUnit
      });
    });

    // Transform nutritionInfo into an array of { name, value, unit }
    const formattedNutritionInfo = Object.keys(nutritionInfo)
      .map((key) => {
        const { value, unit } = nutritionInfo[key];
        if (value.trim() !== '') {
          return {
            name: key.replace(/([A-Z])/g, ' $1').trim().toLowerCase(),
            value: parseFloat(value) || 0,
            unit: unit
          };
        }
        return null;
      })
      .filter((item) => item !== null);

    // Combine predefined nutrition info with custom nutrition fields
    const allNutritionInfo = [...formattedNutritionInfo, ...customNutritionData];

    const productData = {
      barcodes: parsedBarcodes,
      name,
      imageURL: imageUrl,
      ingredients: ingredients.split(';').map((ingredient) => ingredient.trim()),
      artificialIngredients: artificialIngredients.split(';').map((ingredient) => ingredient.trim()),
      nutritionInfo: allNutritionInfo,
      userRating: parseFloat(userRating) || 0,
      numberOfRatings: parseInt(numberOfRatings) || 0,
      categoryId,
      pros: pros.split(';').map((pro) => pro.trim()),
      cons: cons.split(';').map((con) => con.trim()),
      healthScore: parseInt(healthScore) || 0,
      ...customFieldsData
    };

    try {
      const docRef = await addDoc(collection(db, 'products'), productData);
      alert('Product added successfully!');
      setBarcodes('');
      setName('');
      setImageURL('');
      setIngredients('');
      setArtificialIngredients('');
      setNutritionInfo({
        energy: { value: '', unit: 'kcal' },
        protein: { value: '', unit: 'g' },
        totalFat: { value: '', unit: 'g' },
        saturatedFat: { value: '', unit: 'g' },
        carbohydrates: { value: '', unit: 'g' },
        fiber: { value: '', unit: 'g' },
        sugars: { value: '', unit: 'g' },
        calcium: { value: '', unit: 'mg' },
        magnesium: { value: '', unit: 'mg' },
        iron: { value: '', unit: 'mg' },
        zinc: { value: '', unit: 'mg' },
        iodine: { value: '', unit: 'mcg' },
        sodium: { value: '', unit: 'mg' },
        potassium: { value: '', unit: 'mg' },
        phosphorus: { value: '', unit: 'mg' },
        copper: { value: '', unit: 'mg' },
        selenium: { value: '', unit: 'mcg' },
        vitaminA: { value: '', unit: 'mcg' },
        vitaminC: { value: '', unit: 'mg' },
        vitaminD: { value: '', unit: 'mcg' },
        vitaminE: { value: '', unit: 'mg' },
        thiamine: { value: '', unit: 'mg' },
        riboflavin: { value: '', unit: 'mg' },
        niacin: { value: '', unit: 'mg' },
        vitaminB6: { value: '', unit: 'mg' },
        folate: { value: '', unit: 'mcg' },
        vitaminB12: { value: '', unit: 'mcg' },
        fruitsVegetablesNuts: { value: '', unit: '%' }
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
    <div className="form-container">
      <Link to="/health-score" className="test-health-score-btn">
        Test Health Score
      </Link>
      <h1 className="form-title">Add Product</h1>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label>Barcodes (semicolon separated)</label>
          <input
            type="text"
            placeholder="e.g., 12345;67890"
            value={barcodes}
            onChange={(e) => setBarcodes(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            placeholder="e.g., Choco Bar"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div className="form-group">
          <label>Ingredients (semicolon separated)</label>
          <input
            type="text"
            placeholder="e.g., Sugar;Cocoa Butter;Milk Solids"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Artificial Ingredients (semicolon separated)</label>
          <input
            type="text"
            placeholder="e.g., Emulsifier (E322);Color (E102)"
            value={artificialIngredients}
            onChange={(e) => setArtificialIngredients(e.target.value)}
          />
        </div>

        <h2 className="section-title">Nutrition Information</h2>
        {Object.keys(nutritionInfo).map((key) => (
          <div key={key} className="form-group nutrient-group">
            <label>{nutrientAliases[key]}</label>
            <div className="nutrient-inputs">
              <input
                type="text"
                placeholder="Value (e.g., 200)"
                value={nutritionInfo[key].value}
                onChange={(e) =>
                  setNutritionInfo({
                    ...nutritionInfo,
                    [key]: { ...nutritionInfo[key], value: e.target.value }
                  })
                }
              />
              <select
                value={nutritionInfo[key].unit}
                onChange={(e) =>
                  setNutritionInfo({
                    ...nutritionInfo,
                    [key]: { ...nutritionInfo[key], unit: e.target.value }
                  })
                }
              >
                {unitOptions[key].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

        <div className="form-group">
          <label>User Rating</label>
          <input
            type="text"
            placeholder="e.g., 4.5"
            value={userRating}
            onChange={(e) => setUserRating(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Number of Ratings</label>
          <input
            type="text"
            placeholder="e.g., 100"
            value={numberOfRatings}
            onChange={(e) => setNumberOfRatings(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Category ID</label>
          <input
            type="text"
            placeholder="e.g., snacks"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Pros (semicolon separated)</label>
          <input
            type="text"
            placeholder="e.g., Rich in calcium;Low in sodium"
            value={pros}
            onChange={(e) => setPros(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Cons (semicolon separated)</label>
          <input
            type="text"
            placeholder="e.g., High in sugars;Contains artificial colors"
            value={cons}
            onChange={(e) => setCons(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Health Score</label>
          <input
            type="text"
            placeholder="e.g., 75"
            value={healthScore}
            onChange={(e) => setHealthScore(e.target.value)}
          />
        </div>

        <h2 className="section-title">Custom Fields</h2>
        {customFields.map((field) => (
          <div key={field.name} className="form-group">
            <label>{field.name} ({field.type})</label>
            <input
              id={`custom-${field.name}`}
              type="text"
              placeholder={`Enter ${field.name}`}
            />
          </div>
        ))}

        <h2 className="section-title">Custom Nutrition Info Fields</h2>
        {customNutritionFields.map((field) => (
          <div key={field.name} className="form-group nutrient-group">
            <label>{field.name}</label>
            <div className="nutrient-inputs">
              <input
                id={`nutrition-${field.name}`}
                type="text"
                placeholder="Value"
              />
              <select id={`nutrition-unit-${field.name}`}>
                <option value="g">g</option>
                <option value="mg">mg</option>
                <option value="mcg">mcg</option>
                <option value="%">%</option>
              </select>
            </div>
          </div>
        ))}

        <div className="form-group">
          <label>Add Custom Field</label>
          <div className="custom-field-inputs">
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
              Add Nutrition Field
            </button>
          </div>
        </div>

        <button type="submit" className="submit-btn">Add Product</button>
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