import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export default {
  // Server Configuration
  port: parseInt(process.env.PORT || "3001"),
  host: process.env.HOST || "0.0.0.0",
  nodeEnv: process.env.NODE_ENV || "development",

  // MongoDB Configuration
  mongodb: {
    uri:
      process.env.MONGODB_URI ||
      "mongodb://betnad_user:betnad_password@localhost:27017/betnad",
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  },

  // Firebase Configuration
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || "",
    privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID || "",
    privateKey: process.env.FIREBASE_PRIVATE_KEY || "",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
    clientId: process.env.FIREBASE_CLIENT_ID || "",
    authUri: process.env.FIREBASE_AUTH_URI || "",
    tokenUri: process.env.FIREBASE_TOKEN_URI || "",
    authProviderX509CertUrl:
      process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || "",
    clientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL || "",
  },

  // Privy Configuration
  privy: {
    appId: process.env.PRIVY_APP_ID || "",
    appSecret: process.env.PRIVY_APP_SECRET || "",
  },
};
