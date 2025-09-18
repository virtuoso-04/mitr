# Firebase Integration (Auth + Firestore)

## Overview
- Frontend uses Firebase Auth (Anonymous or Google Sign-In) to obtain an ID token.
- Backend verifies ID token with `firebase-admin` and persists chat/journal in Firestore under `/users/{uid}/...`.

## Setup
1. Create a Firebase project and enable Authentication (Anonymous or Google) and Firestore.
2. Create a Service Account key:
   - Firebase Console > Project Settings > Service Accounts > Generate new private key.
   - Base64-encode or JSON-stringify it to place into `.env` as `GOOGLE_APPLICATION_CREDENTIALS_JSON`.

## Backend Env
Add to `backend/.env`:
```
# JSON string of the service account key
GOOGLE_APPLICATION_CREDENTIALS_JSON={...}
```

## Frontend Auth Flow (planned)
- Load Firebase SDK and initialize with your config.
- Sign in anonymously or with Google, then attach `Authorization: Bearer <idToken>` to requests.

## Collections
- `/users/{uid}/chats/{doc}`: { ts, persona, messages, response, crisis }
- `/users/{uid}/journals/{doc}`: { ts, text }
- `/users/{uid}/questionnaires/{doc}`: { ts, body }

Security tip: Keep PII minimal; consider hashing or redaction strategies.
