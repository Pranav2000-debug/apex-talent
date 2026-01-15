import Session from "../models/Session.model.js";
import { chatClient, streamClient } from "../services/stream/stream.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/utilBarrel.js";

export const createSession = asyncHandler(async (req, res) => {
  const { problem, difficulty } = req.body;
  const userId = req.user._id;
  const clerkId = req.user.clerkId;

  if (!problem || !difficulty) {
    throw new ApiError(400, "Problem and Difficulty are required");
  }

  // generate a unique call id for stream video
  const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  // add session in DB
  const session = await Session.create({ problem, difficulty, host: userId, callId });

  // create stream videocall
  await streamClient.video
    .call("default", callId)
    .getOrCreate({ data: { created_by_id: clerkId, custom: { problem, difficulty, sessionId: session._id.toString() } } });

  const channel = chatClient.channel("messaging", callId, { name: `${problem} Session`, created_by_id: clerkId, members: [clerkId] });

  await channel.create();

  res.status(201).json(new ApiResponse(201, session, "Session created"));
});

export const getActiveSession = asyncHandler(async (_, res) => {
  const sessions = await Session.find({ status: "active" }).populate("host", "name profileImage email").sort({ createdAt: -1 }).limit(20);
  if (sessions.length === 0) {
    throw new ApiError(404, "No Active Sessions Found");
  }
  res.status(200).json(new ApiResponse(200, sessions, "Last 20 sessions fetched"));
});

export const getRecentSessions = asyncHandler(async (req, res) => {
  // get sessions where uses is either host or participant
  const userId = req.user._id;
  const sessions = await Session.find({
    status: "completed",
    $or: [{ host: userId }, { participant: userId }],
  })
    .sort({ createdAt: -1 })
    .limit(20);

  res.status(200).json(new ApiResponse(200, sessions, "recent sessions fetched"));
});

export const getSessionById = asyncHandler(async (req, res) => {
  // getting session by id
  const { id } = req.params;
  const session = await Session.findById(id).populate("host", "name email profileImage").populate("participant", "name email profileImage");
  if (!session) {
    throw new ApiError(404, "Session not found");
  }

  res.status(200).json(new ApiResponse(200, session, "Session fetched by ID"));
});

export const joinSession = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const clerkId = req.user.clerkId;

  // First check if the user is trying to join their own session
  const existingSession = await Session.findById(id);
  if (!existingSession) {
    throw new ApiError(404, "Session not found");
  }

  if (existingSession.status !== "active") {
    throw new ApiError(400, "cannot join a completed session");
  }

  if (existingSession.host.toString() === userId.toString()) {
    throw new ApiError(400, "Host cannot join their own sessions");
  }

  // Atomic update: only set participant if it's currently null
  const session = await Session.findOneAndUpdate(
    {
      _id: id,
      participant: null,
    },
    {
      participant: userId,
    },
    {
      new: true, // Return the updated document
    }
  );

  // If findOneAndUpdate returns null, the session is already full
  if (!session) {
    throw new ApiError(409, "Session is full");
  }

  // Only after successful atomic update, add member to chat
  const channel = chatClient.channel("messaging", session.callId);
  await channel.addMembers([clerkId]);

  res.status(200).json(new ApiResponse(200, session));
});

export const endSession = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const session = await Session.findById(id);

  if (!session) throw new ApiError(404, "session not found");

  // check if user is host
  if (session.host.toString() !== userId.toString()) {
    return res.status(403).json({ message: "only the host can end the session" });
  }

  // check if the session is already completed
  if (session.status === "completed") {
    return res.status(403).json({ message: "Session already completed" });
  }

  // delete stream vc
  const call = streamClient.video.call("default", session.callId);
  await call.delete({ hard: true });

  // delete stream chat
  const channel = chatClient.channel("messaging", session.callId);
  await channel.delete();

  session.status = "completed";
  await session.save();
  return res.status(200).json(new ApiResponse(200, null, "Session ended successfully"));
});
