import admin from 'firebase-admin';
import path from 'path';
import { getAuth } from "firebase-admin/auth";
import {serviceAccount as sA}  from "../../envs.js";

/*
 * The firebase admin sdk can only be run by node in our case
 * The admin sdk is mainly used here for handle user account actions
 */

// Function to initialize Firebase Admin
export function initializeFirebase() {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(sA),
    });
    console.log('Firebase Admin initialized successfully.');
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
  }
}

// Function to create a new user
export async function createUser(displayName, email, password, role) {
  try {
    const userRecord = await admin.auth().createUser({
      displayName,
      email,
      password,
    });
    console.log(role);
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: role });

    return userRecord;
  } catch (error) {
    console.error("Error creating new user:", error);
    throw error;
  }
}

// Function to get data from Firestore
// This is probably not needed here
export async function getDataFromFirestore() {
  const db = admin.firestore();
  const snapshot = await db.collection('your-collection').get();
  const data = snapshot.docs.map(doc => doc.data());
  return data;
}

export async function listAllUsers(nextPageToken, allUsers = []) {
  try {
    // Fetch the list of users from Firebase Authentication
    const listUsersResult = await getAuth().listUsers(1000, nextPageToken);

    // Add the current batch of users to the allUsers array
    listUsersResult.users.forEach((userRecord) => {
      allUsers.push(userRecord); // Collect user records
    });

    // Check for the next page token and fetch more users if available
    if (listUsersResult.pageToken) {
      return listAllUsers(listUsersResult.pageToken, allUsers);
    }

    // Return the complete list of users
    return allUsers;
  } catch (error) {
    console.error('Error listing users:', error);
    throw new Error('Failed to list users.'); // Rethrow the error for further handling
  }
}

/*export async function getUserById(uid) {
  getAuth()
    .getUser(uid)
    .then((userRecord) => {
      console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
    }
    ).catch((error) => {
      console.log('Error fetching user data:', error);
    });
}*/


export async function getUserById(uid) {
  try {
    console.log("Fetching");
    const userRecord = await getAuth().getUser(uid);
    const role = await getUserRole(uid);
    const userWithRole = {
          ...userRecord.toJSON(),
          role: role,
        };
    console.log(`Successfully fetched user data: ${userWithRole}`);
    return userWithRole;
  } catch (error) {
    console.log('Error fetching user data:', error);
    throw error;  // Optionally re-throw the error to propagate it
  }
}


/*export async function updateUser(uid, name, email, password, role) {
  getAuth()
    .updateUser(uid, {
      email: email,
      password: password,
      displayName: name,
    })
    .then((userRecord) => {
      await admin.auth().setCustomUserClaims(userRecord.uid, { role: role });
      console.log('Successfully updated user', userRecord.toJSON());
    })
    .catch((error) => {
      console.log('Error updating user:', error);
    });
}*/


export async function updateUser(updatedData) {
  if(updatedData.password) {
    try {
      const userRecord = await getAuth().updateUser(updatedData.uid, {
        email: updatedData.email,
        password: updatedData.password,
        displayName: updatedData.displayName,
      });
      // Use async/await for setCustomUserClaims
      await admin.auth().setCustomUserClaims(userRecord.uid, { role: updatedData.role });
      console.log('Successfully updated user', userRecord.toJSON());
    } catch (error) {
      console.log('Error updating user:', error);
      throw error;  // Optionally re-throw the error to propagate it
    }
  }
  else {
    console.log("no change to password");
    try {
      const userRecord = await getAuth().updateUser(updatedData.uid, {
        email: updatedData.email,
        displayName: updatedData.name,
      });
      // Use async/await for setCustomUserClaims
      await admin.auth().setCustomUserClaims(userRecord.uid, { role: updatedData.role });
      console.log('Successfully updated user', userRecord.toJSON());
    } catch (error) {
      console.log('Error updating user:', error);
      throw error;  // Optionally re-throw the error to propagate it
    }

  }
}

export async function getUserRole(uid) {
  try {
    const userRecord = await getAuth().getUser(uid);
    // The claims can be accessed on the user record.
    return userRecord.customClaims ? userRecord.customClaims['role'] : "User"; // Return role or null if not set
  } catch (error) {
    console.log(error);
    return "Something went wrong"; // Optionally return null or handle the error as needed
  }
}
