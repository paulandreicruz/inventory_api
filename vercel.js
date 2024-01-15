import app from "./app.js";

// This function will be the entry point for the serverless function
export default async function (req, res) {
  // Ensure the app is prepared
  await app.prepare();

  // Pass the request and response objects to the app
  app(req, res);
}
