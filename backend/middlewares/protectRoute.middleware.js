import { requireAuth } from "@clerk/express";
import { User } from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const protectRoute = [
  requireAuth(),
  asyncHandler(async (req, res, next) => {
    console.log("🟡 protectRoute middleware executing");
    console.log("🟡 req.auth:", req.auth);
    
    const clerkId = req.auth?.userId;

    if (!clerkId) {
      console.log("❌ No clerkId found");
      throw new ApiError(401, "Unauthorized request");
    }

    console.log("🟢 clerkId found:", clerkId);

    const user = await User.findOne({ clerkId });
    if (!user) {
      console.log("❌ User not found in database");
      throw new ApiError(404, "User not found");
    }

    console.log("✅ User authenticated:", user.name);
    req.user = user;
    next();
  }),
];
