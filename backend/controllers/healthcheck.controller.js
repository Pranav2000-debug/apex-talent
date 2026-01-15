import { ApiResponse, asyncHandler } from "../utils/utilBarrel.js";

export const healthCheck = asyncHandler(async (req, res) => {
  const health = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
  };
  return res.status(200).json(new ApiResponse(200, health, health.message));
});
