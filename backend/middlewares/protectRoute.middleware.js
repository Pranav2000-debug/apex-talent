import { clerkClient } from "@clerk/express";
import { User } from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const protectRoute = [
  asyncHandler(async (req, res, next) => {
    console.log("🔵 Manual auth check starting");
    console.log("🔵 req.auth type:", typeof req.auth);
    console.log("🔵 Cookies:", req.cookies);
    console.log("🔵 Headers Authorization:", req.headers.authorization);

    try {
      // Call req.auth to get the auth state
      const auth = req.auth();
      console.log("🟢 Auth object:", auth);

      const clerkId = auth?.userId;

      if (!clerkId) {
        console.log("❌ No userId in auth");
        throw new ApiError(401, "Unauthorized request");
      }

      console.log("✅ clerkId found:", clerkId);

      const user = await User.findOne({ clerkId });
      if (!user) {
        console.log("❌ User not found in database for clerkId:", clerkId);
        throw new ApiError(404, "User not found");
      }

      console.log("✅ User authenticated:", user.name);
      req.user = user;
      next();
    } catch (error) {
      console.error("❌ Auth error:", error);
      throw new ApiError(401, "Authentication failed: " + error.message);
    }
  }),
];
