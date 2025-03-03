import * as admin from "firebase-admin";
import { decryptGCPServiceAccount } from "./decrypt";

// Initialize Firebase Admin SDK
let app: admin.app.App;

try {
  // Try to get the existing app
  app = admin.app();
} catch (error) {
  // If no app exists, initialize a new one
  const serviceAccount = decryptGCPServiceAccount();
  
  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const auth = app.auth();
export const firestore = app.firestore();