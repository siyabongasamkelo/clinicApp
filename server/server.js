import dotenv from "dotenv";
import app from "./index.js";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import dns from "node:dns";

dotenv.config({ quiet: true });
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// MongoDB Connection
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGODBCONNECTION);
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

//routes
app.use("/auth", authRoutes);
console.log("CI KEY:", process.env.CLOUDINARY_API_KEY);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
