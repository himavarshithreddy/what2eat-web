import { useState } from "react";
import { db } from "./firebase"; // Import your Firestore config
import { collection, getDocs } from "firebase/firestore";

const DownloadCollection = () => {
  const [downloading, setDownloading] = useState(false);

  const downloadCollection = async () => {
    setDownloading(true);
    const collectionName = "products"; // Change to your collection name
    const querySnapshot = await getDocs(collection(db, collectionName));

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Include document ID
      ...doc.data(), // Include document data
    }));

    const json = JSON.stringify(data, null, 2); // Pretty format JSON
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = `${collectionName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloading(false);
  };

  return (
    <div>
      <button onClick={downloadCollection} disabled={downloading}>
        {downloading ? "Downloading..." : "Download JSON"}
      </button>
    </div>
  );
};

export default DownloadCollection;
