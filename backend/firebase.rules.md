# Firestore Security Model (reference)

This project uses server-side `firebase-admin` to write, so the frontend won't need direct Firestore writes initially. If later exposing direct client writes, consider rules like:

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() { return request.auth != null; }

    match /users/{uid} {
      allow read, write: if signedIn() && request.auth.uid == uid;
    }

    match /users/{uid}/chats/{chatId} {
      allow read, write: if signedIn() && request.auth.uid == uid;
    }

    match /users/{uid}/journals/{entryId} {
      allow read, write: if signedIn() && request.auth.uid == uid;
    }
  }
}
```
