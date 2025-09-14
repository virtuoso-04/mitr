# MindSpace AI Mental Wellness Platform

An AI-powered mental wellness solution designed to support youth mental health with confidential, empathetic guidance.

## 🚀 Project Overview

MindSpace is a mobile-first platform that helps young people overcome mental health stigma and access support through:

- AI-powered chat personas (Arjuna and Maya) trained on mental health data and the Bhagavad Gita
- Detection systems for monitoring mental wellbeing
- Anonymous peer community
- Guided wellness tools and journaling
- Crisis detection and intervention

## 🛠️ Tech Stack

### Frontend
- React Native with Expo SDK
- TypeScript
- React Navigation
- NativeBase/Tamagui UI components

### Backend
- Node.js with Express
- TypeScript
- JWT Authentication
- Google Gemini API for AI chat
- Socket.io for real-time communication

### Database
- MongoDB/PostgreSQL (configurable)
- Redis for caching

## 🏗️ Project Structure

```
mindspace/
├── mobile-app/         # React Native Expo app
├── backend/            # Node.js Express server
├── shared/             # Shared types and utilities
└── docs/               # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI
- MongoDB or PostgreSQL
- Google Gemini API key

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/mindspace.git
   cd mindspace
   ```

2. Install dependencies
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install mobile app dependencies
   cd ../mobile-app
   npm install
   ```

3. Set up environment variables
   - Create `.env` files in both backend and mobile-app directories
   - Add required environment variables (see `.env.example` in each directory)

4. Start the development servers
   ```bash
   # Start backend server
   cd backend
   npm run dev
   
   # Start Expo development server
   cd ../mobile-app
   npm start
   ```

## 📱 Core Features

- **User Authentication**: Secure registration and login system
- **AI Chat System**: Two personas (Arjuna and Maya) offering different support styles
- **Crisis Detection**: Automatic detection of crisis situations with immediate intervention
- **Wellness Tools**: Breathing exercises, journaling, meditation guides
- **Community Support**: Anonymous peer matching and forums
- **Analytics Dashboard**: "Wellness Wrap" visualizing mental health progress

## 🔒 Privacy & Security

MindSpace is built with privacy as a priority:
- End-to-end encryption
- Anonymous user options
- Compliance with data protection regulations
- Secure data storage and processing

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
