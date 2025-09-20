import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { verifyIdToken, mapFirebaseUserToUser } from "../services/firebase";
import { UserModel } from "../models/User";
import {
  LoginRequest,
  LoginResponse,
  VerifyTokenRequest,
  VerifyTokenResponse,
  ErrorResponse,
} from "../types";

const loginSchema = z.object({
  idToken: z.string().min(1, "ID token is required"),
});

const verifyTokenSchema = z.object({
  idToken: z.string().min(1, "ID token is required"),
});

export async function authRoutes(fastify: FastifyInstance) {
  // Login endpoint
  fastify.post<{
    Body: LoginRequest;
    Reply: LoginResponse | ErrorResponse;
  }>(
    "/login",
    {
      schema: {
        body: loginSchema,
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              user: {
                type: "object",
                properties: {
                  uid: { type: "string" },
                  email: { type: "string" },
                  displayName: { type: "string" },
                  photoURL: { type: "string" },
                  walletAddress: { type: "string" },
                  createdAt: { type: "string" },
                  updatedAt: { type: "string" },
                },
              },
              message: { type: "string" },
            },
          },
          400: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              error: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Body: LoginRequest }>,
      reply: FastifyReply
    ) => {
      try {
        const { idToken } = request.body;

        // Verify Firebase ID token
        const decodedToken = await verifyIdToken(idToken);

        // Get user details from Firebase
        const firebaseUser = await fastify.firebase
          .auth()
          .getUser(decodedToken.uid);
        const userData = mapFirebaseUserToUser(firebaseUser);

        // Create or update user in MongoDB
        const user = await UserModel.createOrUpdate(userData);

        const response: LoginResponse = {
          success: true,
          user,
          message: "Login successful",
        };

        return reply.code(200).send(response);
      } catch (error) {
        console.error("Login error:", error);

        const errorResponse: ErrorResponse = {
          success: false,
          error: "LOGIN_FAILED",
          message: error instanceof Error ? error.message : "Login failed",
        };

        return reply.code(400).send(errorResponse);
      }
    }
  );

  // Verify token endpoint
  fastify.post<{
    Body: VerifyTokenRequest;
    Reply: VerifyTokenResponse | ErrorResponse;
  }>(
    "/verify-token",
    {
      schema: {
        body: verifyTokenSchema,
        response: {
          200: {
            type: "object",
            properties: {
              valid: { type: "boolean" },
              user: {
                type: "object",
                properties: {
                  uid: { type: "string" },
                  email: { type: "string" },
                  displayName: { type: "string" },
                  photoURL: { type: "string" },
                  walletAddress: { type: "string" },
                  createdAt: { type: "string" },
                  updatedAt: { type: "string" },
                },
              },
              message: { type: "string" },
            },
          },
          400: {
            type: "object",
            properties: {
              valid: { type: "boolean" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Body: VerifyTokenRequest }>,
      reply: FastifyReply
    ) => {
      try {
        const { idToken } = request.body;

        // Verify Firebase ID token
        const decodedToken = await verifyIdToken(idToken);

        // Get user from MongoDB
        const user = await UserModel.findByUid(decodedToken.uid);

        if (!user) {
          const response: VerifyTokenResponse = {
            valid: false,
            message: "User not found in database",
          };
          return reply.code(200).send(response);
        }

        const response: VerifyTokenResponse = {
          valid: true,
          user,
          message: "Token is valid",
        };

        return reply.code(200).send(response);
      } catch (error) {
        console.error("Token verification error:", error);

        const response: VerifyTokenResponse = {
          valid: false,
          message:
            error instanceof Error
              ? error.message
              : "Token verification failed",
        };

        return reply.code(200).send(response);
      }
    }
  );

  // Health check endpoint
  fastify.get(
    "/health",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return reply.code(200).send({
        status: "ok",
        timestamp: new Date().toISOString(),
        service: "auth-service",
      });
    }
  );
}
