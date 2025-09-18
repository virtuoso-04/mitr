import admin from "firebase-admin";

let authReady = false;
const CREDS_JSON = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

try {
  if (CREDS_JSON && !admin.apps.length) {
    const creds = JSON.parse(CREDS_JSON);
    admin.initializeApp({ credential: admin.credential.cert(creds) });
    authReady = true;
  } else if (!CREDS_JSON) {
    console.warn("Firebase admin not initialized: missing GOOGLE_APPLICATION_CREDENTIALS_JSON");
  } else if (admin.apps.length) {
    authReady = true;
  }
} catch (e) {
  console.warn("Firebase admin init failed:", e.message);
  authReady = false;
}

export function isAuthReady() { return authReady; }

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing Authorization Bearer token" });
  if (!authReady) return res.status(500).json({ error: "Auth not configured" });
  admin
    .auth()
    .verifyIdToken(token)
    .then((decoded) => {
      req.user = { uid: decoded.uid };
      next();
    })
    .catch((e) => res.status(401).json({ error: "Invalid token" }));
}

export function getDb() {
  if (!authReady) throw new Error("Firebase admin not initialized");
  return admin.firestore();
}
