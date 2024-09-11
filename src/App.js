import { addDoc, collection, writeBatch } from "firebase/firestore";
import Papa from "papaparse";
import { db } from "./firebase/firebase_config";
import { useState } from "react";
import './App.css';

function App() {
  const [csvFile, setCsvFile] = useState(null);

  const handleChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!csvFile) return;

    Papa.parse(csvFile, {
      header: true,
      complete: async (results) => {
        const data = results.data;
        try {
          const batch = writeBatch(db);
          const collectionRef = collection(db, "question-app");
          data.forEach(async (row) => {
            const docRef = await addDoc(collectionRef, row);
            batch.set(docRef, row);
          });
          await batch.commit();
          alert("Data saved successfully!");
        } catch (error) {
          console.error("Error saving data: ", error);
        }
      },
    });
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="file"
          name="file"
          onChange={handleChange}
          accept=".csv"
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default App;
