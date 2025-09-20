# BetNad Backend

Fastify-based backend API with Firebase authentication and MongoDB integration.

## Features

- 🔐 Firebase Authentication
- 🗄️ MongoDB integration
- ⚡ Fastify framework
- 🛡️ Security middleware (CORS, Helmet, Rate Limiting)
- 📝 TypeScript support
- 🔄 Auto-reload in development

## Quick Start

1. **Install dependencies:**

   ```bash
   cd packages/backend
   yarn install
   ```

2. **Set up environment variables:**
   Create a `.env` file based on `.env.example`:

   ```bash
   cp .env.example .env
   ```

3. **Configure Firebase:**

   - Get your Firebase service account key from Firebase Console
   - Update the Firebase environment variables in `.env`

4. **Start MongoDB:**

   ```bash
   # From project root
   docker-compose up -d
   ```

5. **Start the backend:**

   ```bash
   # Development mode
   yarn dev

   # Production mode
   yarn build
   yarn start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login with Firebase ID token
- `POST /api/auth/verify-token` - Verify Firebase ID token
- `GET /api/auth/health` - Health check

### General

- `GET /` - API information

## Environment Variables

| Variable                | Description               | Default                                                        |
| ----------------------- | ------------------------- | -------------------------------------------------------------- |
| `PORT`                  | Server port               | `3001`                                                         |
| `HOST`                  | Server host               | `0.0.0.0`                                                      |
| `NODE_ENV`              | Environment               | `development`                                                  |
| `MONGODB_URI`           | MongoDB connection string | `mongodb://betnad_user:betnad_password@localhost:27017/betnad` |
| `CORS_ORIGIN`           | CORS allowed origin       | `http://localhost:3000`                                        |
| `FIREBASE_PROJECT_ID`   | Firebase project ID       | Required                                                       |
| `FIREBASE_PRIVATE_KEY`  | Firebase private key      | Required                                                       |
| `FIREBASE_CLIENT_EMAIL` | Firebase client email     | Required                                                       |

## Development

```bash
# Install dependencies
yarn install

# Run in development mode
yarn dev

# Build for production
yarn build

# Run production build
yarn start

# Lint code
yarn lint

# Fix linting issues
yarn lint:fix
```

## Project Structure

```
src/
├── index.ts           # Main server file
├── types/             # TypeScript type definitions
├── models/            # Database models
├── routes/            # API routes
├── services/          # External services (Firebase)
└── utils/             # Utility functions
```

## Integration with Frontend

The backend is designed to work with the Next.js frontend. Make sure to:

1. Set the correct `CORS_ORIGIN` in your `.env` file
2. Use the backend URL in your frontend API calls
3. Handle Firebase authentication on the frontend
4. Send the Firebase ID token to the backend for authentication
