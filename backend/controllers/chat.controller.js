import { chatClient } from "../services/stream/stream.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getStreamToken = asyncHandler(async (req, res) => {
  // Debug logs
  console.log("=== DEBUG getStreamToken ===");
  console.log("req.user:", req.user);
  console.log("req.user.clerkId:", req.user?.clerkId);
  console.log("req.user._doc:", req.user?._doc); // Mongoose sometimes hides fields
  
  // Check if clerkId exists
  if (!req.user || !req.user.clerkId) {
    throw new ApiError(400, "User clerkId is missing");
  }

  const token = chatClient.createToken(req.user.clerkId);
  
  const response = {
    token,
    userId: req.user.clerkId,
    userName: req.user.name,
    userImage: req.user.profileImage || req.user.image || "",
  };
  
  console.log("Response to send:", response);
  
  return res.status(200).json(
    new ApiResponse(200, response, "Token generated successfully")
  );
});