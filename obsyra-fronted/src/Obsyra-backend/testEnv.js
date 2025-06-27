require("dotenv").config();

console.log("PROJECT ID:", process.env.FIREBASE_PROJECT_ID);
console.log("CLIENT EMAIL:", process.env.GOOGLE_CLIENT_EMAIL);
console.log("PRIVATE KEY:", process.env.GOOGLE_PRIVATE_KEY ? "ok" : "no definido");
