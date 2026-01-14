import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import healthcheckRouter from "./routes/healthcheck.route.js";
import { serve } from "inngest/express";
import { inngest } from "./services/inngest/inngest.js";
import { functions } from "./services/inngest/inngest.js";

const app = express();

app.set("trust proxy", 1);
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? process.env.CLIENT_URL : "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "24kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.use("/api", healthcheckRouter);

app.use("/api/inngest", serve({ client: inngest, functions }));

export default app;
