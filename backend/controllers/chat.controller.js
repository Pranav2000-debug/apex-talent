import { chatClient } from "../services/stream/stream.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getStreamToken = asyncHandler(async (req, res) => {
  // using clerkId for stream since Stream uses clerkId for a user's id
  // using the create token method, pass the clerkId parameter to generate a "client-side token".
  const { clerkId, name, profileImage } = req.user;
  const token = chatClient.createToken(clerkId);
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        token,
        userId: clerkId,
        userName: name,
        userImage: profileImage,
      },
      "token generated"
    )
  );
});
