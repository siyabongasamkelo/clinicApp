import express from "express";
import fileupload from "express-fileupload";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./routes/authRoutes.js"; // doing this for tests to access routers
import { swaggerSpec } from "./config/swagger.js";

//middlewares
const app = express();
app.use(morgan("dev"));

app.use(cors());
app.use(express.json());
app.use(fileupload({ useTempFiles: true }));

app.use("/auth", authRoutes); // for tests

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
