import express from "express";
import { healthCheck } from "../controllers/healthcheck.controller.js";

const healthcheckRouter = express.Router();

healthcheckRouter.get("/health", healthCheck);

export default healthcheckRouter;
