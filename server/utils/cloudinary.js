import { createRequire } from "module";
const require = createRequire(import.meta.url);
const cloudinary = require("cloudinary").v2;
if (process.env.NODE_ENV !== "CI") {
  import("dotenv").then((dotenv) => dotenv.config());
}

console.log("CI KEY:", process.env.CLOUDINARY_API_KEY);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.COLUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };
