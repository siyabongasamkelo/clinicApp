// import express, { Application } from "express";
import type { Application } from "express";
import express from "express";
import fileupload from "express-fileupload";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./routes/authRoutes.js"; // Keep .js extension for ESM/TS
import { swaggerSpec } from "./config/swagger.js";
import helmet from "helmet";
import { errorMiddleware } from "./middleware/errorMiddleware.ts";
// import appointmentRoutes from "./routes/appointmentRoutes.js";
import doctorRoute from "./routes/doctorRoute.ts";
import nurseRoute from "./routes/nurseRoutes.ts";
import patientRoute from "./routes/patientRoute.ts";
import clinicRoute from "./routes/clinicRoutes.ts";

// Initialize the app with the Application type
const app: Application = express();

// Middlewares
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", "res.cloudinary.com"],
      },
    },
  }),
);

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// fileupload usually needs a 'any' cast if types are tricky,
// but basic usage works like this:
// app.use(fileupload({ useTempFiles: true }));

app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    parseNested: true, // <--- This MUST be true for address[city] to work
  }),
);

// Routes
app.use("/auth", authRoutes);
app.use("/doctor", doctorRoute);
app.use("/nurse", nurseRoute);
app.use("/patient", patientRoute);
app.use("/clinic", clinicRoute);
// app.use("/api/appointments", appointmentRoutes);

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//error middleware
app.use(errorMiddleware);

export default app;
