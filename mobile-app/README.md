# MindSpace Mobile App

React Native mobile application for the MindSpace AI Mental Wellness Platform.

## Features

- User authentication (login/register)
- AI Chat with two personas (Arjuna and Maya)
- Wellness tracking and analytics
- Daily challenges and rewards
- Community support
- Crisis detection and intervention

## Tech Stack

- React Native with Expo SDK
- TypeScript
- React Navigation for routing
- NativeBase UI components
- Context API for state management
- Async Storage for local data storage

## Setup

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator (optional)

### Installation

1. Install dependencies

```bash
npm install
```

2. Set up environment variables

Create a `.env` file based on the `.env.example` template and add your configuration values:

```
API_URL=http://localhost:5000/api
```

3. Start the development server

```bash
npm start
```

4. Run on a device or simulator

- Press `i` to run on iOS simulator
- Press `a` to run on Android emulator
- Or scan the QR code with the Expo Go app on your physical device

## Folder Structure

- `assets/` - Images, fonts, and other static assets
- `src/` - Source code
  - `components/` - Reusable React components
  - `contexts/` - React Context providers
  - `hooks/` - Custom React hooks
  - `navigation/` - Navigation configuration
  - `screens/` - App screens
  - `services/` - API services
  - `types/` - TypeScript type definitions
  - `utils/` - Utility functions
  - `theme.ts` - App theming

## Main Screens

- **Auth Screens**
  - Login
  - Register
  - Forgot Password

- **Main Screens**
  - Home (Dashboard)
  - Chat (AI Conversation)
  - Community
  - Wellness Tools
  - Profile

## Building for Production

To create a production build:

1. Configure app.json with your app details
2. Build for specific platforms:

```bash
# For Android
expo build:android

# For iOS
expo build:ios
```
