import * as admin from "firebase-admin";
import { User } from "../types";

// Initialize Firebase Admin SDK
export function initializeFirebase(): void {
  if (admin.apps.length === 0) {
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url:
        process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });

    console.log("✅ Firebase Admin SDK initialized");
  }
}

export async function verifyIdToken(
  idToken: string
): Promise<admin.auth.DecodedIdToken> {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error("❌ Firebase token verification failed:", error);
    throw new Error("Invalid or expired token");
  }
}

export async function getUserByUid(
  uid: string
): Promise<admin.auth.UserRecord> {
  try {
    const userRecord = await admin.auth().getUser(uid);
    return userRecord;
  } catch (error) {
    console.error("❌ Failed to get user by UID:", error);
    throw new Error("User not found");
  }
}

export function mapFirebaseUserToUser(
  firebaseUser: admin.auth.UserRecord
): User {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || "",
    displayName: firebaseUser.displayName || undefined,
    photoURL: firebaseUser.photoURL || undefined,
    createdAt: new Date(firebaseUser.metadata.creationTime),
    updatedAt: new Date(
      firebaseUser.metadata.lastSignInTime || firebaseUser.metadata.creationTime
    ),
  };
}
