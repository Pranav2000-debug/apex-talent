import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import { serve } from "inngest/express";
import { inngest } from "./services/inngest/inngest.js";
import { functions } from "./services/inngest/inngest.js";
import { clerkMiddleware } from "@clerk/express";
import { errorHandler } from "./middlewares/error.middleware.js";

// Router Imports
import healthcheckRouter from "./routes/healthcheck.route.js";
import chatRouter from "./routes/chat.routes.js";
import sessionRouter from "./routes/session.routes.js";

const app = express();

app.set("trust proxy", 1); // for nginx
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
app.use(clerkMiddleware()); // this adds auth field to the req object just like jwt flow. req.user = user after verification, in clerk we utilize this with req.auth

app.use("/api", healthcheckRouter);

app.use("/api/inngest", serve({ client: inngest, functions })); // background job for user sync clerk<->db<->stream using inngest and clerk webhook

// protected routes
app.use("/api/chat", chatRouter); // generating a token for Stream for VCs, Chat and other stream services.
app.use("/api/sessions", sessionRouter);

// express error handler middleware
app.use(errorHandler);

export default app;
