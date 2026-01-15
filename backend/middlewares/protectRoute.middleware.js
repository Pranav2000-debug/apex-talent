import { requireAuth } from "@clerk/express";
import { User } from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const protectRoute = [
  requireAuth({signInUrl: "/sign-in"}),
  asyncHandler(async (req, res, next) => {
    const clerkId = req.auth()?.userId;

    if (!clerkId) {
      throw new ApiError(401, "Unauthorized request");
    }

    const user = await User.findOne({ clerkId });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    req.user = user; // same as JWT flow
    next();
  }),
];
