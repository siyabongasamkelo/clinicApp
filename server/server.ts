import dotenv from "dotenv";
import index from "./index.ts";
import mongoose from "mongoose";
import dns from "node:dns";
import logger from "./utils/logger.js";

logger.info("Checking Winston: The ClinicApp is live!");
dotenv.config({ quiet: true });

// Cloudinary/MongoDB often have DNS issues on some networks; this helps.
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// 1. Handle Environment Variables Safely
const mongoUri = process.env.MONGODBCONNECTION;

if (!mongoUri) {
  console.error("Fatal Error: MONGODBCONNECTION is not defined in .env");
  process.exit(1);
}

// 2. MongoDB Connection
mongoose.set("strictQuery", true);

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("MongoDB database connection established successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// 3. Start Server
const PORT = process.env.PORT || 5000;

index.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
