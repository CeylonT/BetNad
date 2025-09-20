import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import dotenv from "dotenv";
import { connectToDatabase, closeDatabaseConnection } from "./utils/mongodb";
import { initializeFirebase, privyClient } from "./services/firebase";
import { authRoutes } from "./routes/auth";

// Load environment variables
dotenv.config();

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    prettyPrint: process.env.NODE_ENV === "development",
  },
});

// Register plugins
async function registerPlugins() {
  // CORS
  await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  });

  // Security headers
  await fastify.register(helmet, {
    contentSecurityPolicy: false,
  });

  // Rate limiting
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });
}

// Register routes
async function registerRoutes() {
  // Health check
  fastify.get("/", async (request, reply) => {
    return {
      message: "BetNad Backend API",
      version: "1.0.0",
      status: "running",
      timestamp: new Date().toISOString(),
    };
  });

  // API routes
  await fastify.register(authRoutes, { prefix: "/api/auth" });
}

// Graceful shutdown
async function gracefulShutdown() {
  console.log("🛑 Graceful shutdown initiated...");

  try {
    await closeDatabaseConnection();
    await fastify.close();
    console.log("✅ Graceful shutdown completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during graceful shutdown:", error);
    process.exit(1);
  }
}

// Start server
async function start() {
  try {
    // Initialize services
    console.log("🚀 Starting BetNad Backend...");

    // Connect to MongoDB
    await connectToDatabase();

    // Initialize Firebase
    initializeFirebase();

    // Make Privy client available globally
    fastify.decorate("privy", privyClient);

    // Register plugins and routes
    await registerPlugins();
    await registerRoutes();

    // Start server
    const port = parseInt(process.env.PORT || "3001");
    const host = process.env.HOST || "0.0.0.0";

    await fastify.listen({ port, host });

    console.log(`✅ Server running on http://${host}:${port}`);
    console.log(`📚 API Documentation: http://${host}:${port}/docs`);

    // Handle graceful shutdown
    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Start the server
start();
