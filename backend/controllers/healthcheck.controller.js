import { asyncHandler } from "../utils/utilBarrel.js";

export const healthCheck = asyncHandler(async (req, res) => {
  const health = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
  };

  try {
    res.send(health);
  } catch (error) {
    health.message = error;
    res.status(503).send();
  }
});
