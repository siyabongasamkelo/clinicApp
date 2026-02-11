import dotenv from "dotenv";
import app from "./index.js";
import mongoose from "mongoose";

dotenv.config();

// MongoDB Connection
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGODBCONNECTION);
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
