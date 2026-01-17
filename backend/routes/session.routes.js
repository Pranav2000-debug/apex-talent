import express from "express";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";
import { createSession, endSession, getActiveSession, getRecentSessions, getSessionById, joinSession } from "../controllers/session.controller.js";

const sessionRouter = express.Router();

sessionRouter.post(
  "/",
  (req, res, next) => {
    console.log("🔵 POST /sessions route hit!");
    console.log("🔵 Request body:", req.body);
    console.log("🔵 Request headers:", req.headers);
    next();
  },
  protectRoute,
  createSession,
);
sessionRouter.get("/active", protectRoute, getActiveSession);
sessionRouter.get("/my-recent", protectRoute, getRecentSessions);

// session management
sessionRouter.get("/:id", protectRoute, getSessionById);
sessionRouter.post("/:id/join", protectRoute, joinSession);
sessionRouter.post("/:id/end", protectRoute, endSession);

export default sessionRouter;
