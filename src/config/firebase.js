import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc, setDoc, query, where} from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {firebaseConfig as fC}  from "../../envs.js";

/*
 * This file contains the functions for general firebase actions
 */

// Initialize Firebase
const app = initializeApp(fC);

export const auth = getAuth(app);
export const db = getFirestore(app);

// These are the functions related to Login
export function handleLogin(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Sign in Successfull");
      return user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      throw new Error(errorMessage);
    });
};

// These are the functions related to Products

export const listAllProducts = async () => {
  console.log("Attempting to fetch products...");
  try {
    const productCollection = collection(db, "products"); // Ensure "products" matches your Firestore collection name
    const productSnapshot = await getDocs(productCollection);
    const productList = productSnapshot.docs.map((doc, index) => ({
      id: doc.id,
      slNo: index + 1,
      ...doc.data(),
    }));
    return productList;
  } catch (error) {
    console.error("Error fetching products:", error.message);
    throw new Error("Failed to fetch products.");
  }
};

export const addProduct = async (productData) => {
  try {
    console.log("Starting to send");
    console.log(productData);
    const docRef = await addDoc(collection(db, "products"), productData);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id; // Return the document ID if needed
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e; // Rethrow the error for handling in the component
  }
};
//EDIT PRODUCTS
/**
 * Fetch product details by ID from Firebase.
 * @param {string} productId - The ID of the product to fetch.
 * @returns {Promise<Object>} The product details.
 */
export const getProductById = async (productId) => {
  const productDoc = doc(db, "products", productId);
  const snapshot = await getDoc(productDoc);

  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  } else {
    throw new Error("Product not found");
  }
};

/**
 * Update product details in Firebase.
 * @param {string} productId - The ID of the product to update.
 * @param {Object} updatedData - The updated product data.
 * @returns {Promise<void>}
 */
export const updateProduct = async (productId, updatedData) => {
  const productDoc = doc(db, "products", productId);
  await updateDoc(productDoc, updatedData);
};


// These are the functions related to Quotation
export const fetchQuotations = async () => {
  try {
    const quotationsCollection = collection(db, "quotations");
    const snapshot = await getDocs(quotationsCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching quotations:", error);
  }
}


// Update quotation status
export const updateQuotationStatus = async (id, newStatus) => {
  try {
    const quotationRef = doc(db, "quotations", id);
    await updateDoc(quotationRef, { status: newStatus });
  } catch (error) {
    console.error("Error updating quotation status:", error);
    throw error;
  }
};

// Upload a PDF URL for a quotation
export const uploadQuotationPdf = async (id, pdfUrl) => {
  try {
    const quotationRef = doc(db, "quotations", id);
    await updateDoc(quotationRef, { pdfUrl });
  } catch (error) {
    console.error("Error uploading quotation PDF:", error);
    throw error;
  }
};

// Delete a quotation
export const deleteQuotation = async (id) => {
  try {
    const quotationRef = doc(db, "quotations", id);
    await deleteDoc(quotationRef);
  } catch (error) {
    console.error("Error deleting quotation:", error);
    throw error;
  }
};

// Fetch specific quotation details by ID
export const fetchQuotationById = async (id) => {
  try {
    const quotationRef = doc(db, "quotations", id);
    const snapshot = await getDoc(quotationRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    } else {
      throw new Error("Quotation not found");
    }
  } catch (error) {
    console.error("Error fetching quotation by ID:", error);
  }
};
// Update sales amount for a quotation
export const updateQuotationSalesAmount = async (id, salesAmount) => {
  try {
    const quotationRef = doc(db, "quotations", id);
    await updateDoc(quotationRef, { salesAmount });
  } catch (error) {
    console.error("Error updating sales amount:", error);
    throw error;
  }
};



//Fetch punchin details
/*export const fetchPunchRecords = async () => {
  try {
    const employeesRef = collection(db, "employess");
    const employeeSnapshots = await getDocs(employeesRef);
    let records = [];

    for (const employeeDoc of employeeSnapshots.docs) {
      const employeeId = employeeDoc.id;
      const punchInsRef = collection(db, "employess", employeeId, "punch_ins");
      const punchSnapshots = await getDocs(punchInsRef);

      punchSnapshots.forEach((punchDoc) => {
        const punchData = punchDoc.data();

        // Parse timestamps from Firestore or string format
        const recordTimestamp = punchData.timestamp?.toDate() || new Date(punchData.punch_in_time);

        records.push({
          id: punchDoc.id,
          employeeId,
          photoUrl: punchData.photo_url || "",
          location: punchData.location || null,
          punchInTime: punchData.punch_in_time || "",
          punchOutTime: punchData.punch_out_time || "",
          timestamp: recordTimestamp,
          userEmail: punchData.user_email || "",
          userId: punchData.user_id || "",
        });
        console.log("\nreached inner loop");
        console.log("current Records:", records);
      });
      console.log("Fetched Records:", records);
    }

    // Sort records by timestamp descending
    records.sort((a, b) => b.timestamp - a.timestamp);

    console.log("Total Records:", records); // Debug output
    return records;
  } catch (error) {
    console.error("Error fetching punch records:", error);
    throw error;
  }
};*/

export const fetchPunchRecords = async () => {
  try {
    const employeesRef = collection(db, "employess");
    const employeeSnapshots = await getDocs(employeesRef);
    let records = [];

    for (const employeeDoc of employeeSnapshots.docs) {
      const employeeId = employeeDoc.id;
      const punchInsRef = collection(db, "employess", employeeId, "punch_ins");
      const punchSnapshots = await getDocs(punchInsRef);

      punchSnapshots.forEach((punchDoc) => {
        const punchData = punchDoc.data();

        records.push({
          id: punchDoc.id,
          employeeId,
          photoUrl: punchData.photo_url || "",
          location: punchData.location || null,
          punchInTime: punchData.punch_in_time || "",
          punchOutTime: punchData.punch_out_time || "",
          timestamp: punchData.timestamp?.toDate(),
          userEmail: punchData.user_email || "",
          userId: punchData.user_id || "",
          // Dummy name for now; fetch the actual name via authentication
          displayName: "Loading...",
        });
      });
    }

    console.log("Fetched Records:", records);
    return records;
  } catch (error) {
    console.error("Error fetching punch records:", error);
    throw error;
  }
};


export const calculatePunchStatistics = (records) => {
  const stats = {
    totalEmployees: new Set(records.map((r) => r.employeeId)).size,
    totalPunches: records.length,
    onTime: 0,
    late: 0,
    earlyDepartures: 0,
    missingPunchOut: 0,
    averageWorkHours: 0,
  };

  const workStartHour = 9; // Start of work day
  let totalWorkHours = 0;
  let validWorkHourRecords = 0;

  records.forEach((record) => {
    if (!record.punchInTime) return;

    const punchInDate = new Date(record.punchInTime);

    // Check if late (after 9:15 AM)
    if (
      punchInDate.getHours() > workStartHour ||
      (punchInDate.getHours() === workStartHour && punchInDate.getMinutes() > 15)
    ) {
      stats.late++;
    } else {
      stats.onTime++;
    }

    // Check punch-out status
    if (!record.punchOutTime) {
      stats.missingPunchOut++;
    } else {
      const punchOutDate = new Date(record.punchOutTime);
      const workHours = (punchOutDate - punchInDate) / (1000 * 60 * 60); // Convert to hours

      if (workHours < 8) {
        stats.earlyDepartures++;
      }

      totalWorkHours += workHours;
      validWorkHourRecords++;
    }
  });

  stats.averageWorkHours = validWorkHourRecords
    ? (totalWorkHours / validWorkHourRecords).toFixed(2)
    : 0;

  console.log("Calculated Stats:", stats); // Debug output
  return stats;
};


//Request Page functions

// Fetch all pending requests
/*export const fetchPendingRequests = async () => {
  try {
    const requestsCollection = collection(db, "editrequests");
    const pendingRequestsQuery = query(
      requestsCollection,
      where("status", "==", "pending")
    );
    const requestSnapshots = await getDocs(pendingRequestsQuery);

    return requestSnapshots.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    throw error;
  }
};*/


// Fetch all pending requests
export const getPendingRequests = async () => {
  const querySnapshot = await getDocs(collection(db, "requests"));
  const data = [];
  querySnapshot.forEach((doc) => {
    const request = doc.data();
    if (request.status === "pending") {
      data.push({ id: doc.id, ...request });
    }
  });
  return data;
};

// Accept a request and update the corresponding quotation's status
/*export const acceptRequest = async (requestId) => {
  try {
    // Update the request status to "accepted"
    const requestRef = doc(db, "editrequests", requestId);
    const requestSnapshot = await getDoc(requestRef);

    if (!requestSnapshot.exists()) {
      throw new Error("Request not found");
    }

    const requestData = requestSnapshot.data();

    // Update the request status
    await updateDoc(requestRef, { status: "accepted" });

    // Update the corresponding quotation's status to "pending review"
    const quotationRef = doc(db, "quotations", requestData.quotationId);
    const quotationSnapshot = await getDoc(quotationRef);

    if (!quotationSnapshot.exists()) {
      throw new Error("Quotation not found");
    }

    await updateDoc(quotationRef, { status: "pending review" });
  } catch (error) {
    console.error("Error accepting request:", error);
    throw error;
  }
};*/


// Fetch quotation by ID
export const getQuotationById = async (qid) => {
  const quotationRef = doc(db, "quotations", qid);
  const docSnap = await getDoc(quotationRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error("Quotation not found");
  }
};
// Update request status
export const updateRequest = async (id, data) => {
  const docRef = doc(db, "requests", id);
  await updateDoc(docRef, data);
};

// Update quotation status
export const updateQuotation = async (qid, data) => {
  const docRef = doc(db, "quotations", qid);
  await updateDoc(docRef, data);
};

// Reject a request without changing the quotation's status
/*export const rejectRequest = async (requestId) => {
  try {
    const requestRef = doc(db, "editrequests", requestId);
    await updateDoc(requestRef, { status: "rejected" });
  } catch (error) {
    console.error("Error rejecting request:", error);
    throw error;
  }
};*/

// These are the functions related to Requests
//

// These are the functions related to employees
export async function addUserToDb(userRecord, role) {
  const userDetails = {
    email: userRecord.email,
    displayName: userRecord.displayName,
    role: role,
  }

  try {
    await setDoc(doc(db, "employess", userRecord.uid), userDetails);
    console.log(userDetails);
  } catch(error) {
    console.error("Error writing document: ", error);
  }
};

export async function updateUserInDb(uid, updatedData) {
  const userDetails = {
    email: updatedData.email,
    displayName: updatedData.displayName,
    role: updatedData.role,
  };

  try {
    // Update the document in the "employees" collection
    await setDoc(doc(db, "employess", uid), userDetails, { merge: true });
    console.log("User document successfully updated in Firestore");
  } catch (error) {
    console.error("Error updating user document in Firestore: ", error);
  }
};

