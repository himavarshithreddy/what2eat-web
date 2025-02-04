import { useState } from "react";
import { db } from "./firebase"; // Import your Firestore config
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { deleteField } from "firebase/firestore"; // Import deleteField

const UpdateBarcodes = () => {
  const [updating, setUpdating] = useState(false);

  const updateBarcodes = async () => {
    setUpdating(true);
    const collectionName = "products"; // Change to your collection name
    const querySnapshot = await getDocs(collection(db, collectionName));

    const updates = querySnapshot.docs.map(async (document) => {
      const data = document.data();
      if (typeof data.barcode === "string") {
        const docRef = doc(db, collectionName, document.id);
        await updateDoc(docRef, {
          barcodes: [data.barcode], // Convert to array
          barcode: deleteField(), // Proper way to delete a field
        });
      }
    });

    await Promise.all(updates);
    setUpdating(false);
    alert("All barcode fields updated to barcodes array and old field removed!");
  };

  return (
    <div>
      <button onClick={updateBarcodes} disabled={updating}>
        {updating ? "Updating..." : "Update Barcodes"}
      </button>
    </div>
  );
};

export default UpdateBarcodes;
