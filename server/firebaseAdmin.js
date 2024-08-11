const admin = require("firebase-admin");
const path = require("path");

function initializeFirebaseAdmin() {
  try {
    if (!admin.apps.length) {
      const serviceAccount = require(path.join(
        __dirname,
        "../config/serviceAccountKey.json"
      ));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("Firebase Admin SDK initialized successfully");
    }
    return admin.firestore();
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
    return null;
  }
}

const db = initializeFirebaseAdmin();

module.exports = { admin, db };
