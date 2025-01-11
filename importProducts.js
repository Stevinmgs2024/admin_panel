import admin from "firebase-admin";
import * as XLSX from "xlsx";
// Initialize Firebase Admin SDK
//const serviceAccount = require("./env.js"); // Replace with the actual path to your key
import {serviceAccount as serviceAccount}  from "./envs.js";
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Load Excel File
const workbook = XLSX.readFile("E:\PRODUCT LIST.xlsx"); // Replace with your Excel file name
const sheetName = workbook.SheetNames[0];
const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

// Extract Company Name from the First Row
const companyName = sheet[0]["company name"]; // Assumes "company name" is the header
if (!companyName) {
  console.error("Company name not found in the first row.");
  process.exit(1);
}

// Process and Transform Data
const products = sheet.slice(1).map((row) => {
  return {
    companyName: companyName, // Add company name to each product
    name: row["name"] || "", // Default blank if missing
    description: row["description"] || "",
    id: row["id"] || "",
    msrp: row["msrp"] || "",
    quantity: row["quantity"] || "",
  };
});

// Write to Firebase
(async () => {
  try {
    const batch = db.batch();
    const productsCollection = db.collection("products");

    products.forEach((product) => {
      const docRef = productsCollection.doc(product.id || db.collection("products").doc().id);
      batch.set(docRef, product);
    });

    await batch.commit();
    console.log(`${products.length} products imported successfully.`);
  } catch (error) {
    console.error("Error importing products:", error);
  }
})();
