import express from "express";
import fileupload from "express-fileupload";
import cors from "cors";
import morgan from "morgan";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./routes/authRoutes.js"; // doing this for tests to access routers

//middlewares
const app = express();
app.use(morgan("dev"));

app.use(cors());
app.use(express.json());
app.use(fileupload({ useTempFiles: true }));

app.use("/auth", authRoutes); // for tests

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Clinic App API",
      version: "1.0.0",
      description: "API documentation for the Clinic app backend",
    },
  },
  apis: ["./routes/*.js"], // where your route files are
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default app;
