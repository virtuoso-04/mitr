# MindSpace Backend API

This is the backend server for the MindSpace AI Mental Wellness Platform, providing the API for the mobile application.

## Features

- User authentication (register, login, profile)
- AI Chat system with two personas (Arjuna and Maya)
- Crisis detection and intervention
- Real-time communication with Socket.IO
- MongoDB database integration

## Tech Stack

- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- Google Gemini API for AI capabilities
- JWT authentication
- Socket.IO for real-time features
- Zod for validation

## Setup

### Prerequisites

- Node.js 18+ installed
- MongoDB running locally or connection string to MongoDB Atlas
- Google Gemini API key

### Installation

1. Install dependencies

```bash
npm install
```

2. Set up environment variables

Create a `.env` file based on the `.env.example` template and add your configuration values:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mindspace
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key
```

3. Build the project

```bash
npm run build
```

4. Start the server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/profile` - Get user profile (requires authentication)

### Chat

- `POST /api/chat/message` - Send a message to the AI (requires authentication)
- `GET /api/chat/history` - Get conversation history (requires authentication)
- `GET /api/chat/personas` - Get available AI personas (requires authentication)

### Crisis Support

- `POST /api/crisis/report` - Report a crisis situation (requires authentication)
- `GET /api/crisis/helplines` - Get crisis helpline information (requires authentication)

## Socket.IO Events

- `connection` - User connected
- `disconnect` - User disconnected
- `send_message` - Client sends a message
- `message_response` - Server sends AI response
- `typing` - AI is typing indicator
