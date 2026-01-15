import { StreamChat } from "stream-chat";
import { ENV } from "../../env.js";
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("Stream api key or secret is missing");
}

export const chatClient = StreamChat.getInstance(apiKey, apiSecret); // for chat features
export const streamClient = new StreamClient(apiKey, apiSecret); // for vc

// funcs for chat/user creation in getStream
export const upsertStreamUser = async (userData) => {
  try {
    await chatClient.upsertUser(userData);
    console.log("Stream user upserted successfully: ", userData);
  } catch (error) {
    console.error("Error upserting stream user", error);
  }
};

export const deleteStreamUser = async (userId) => {
  try {
    await chatClient.deleteUser(userId);
    console.log("Stream user deleted successfully: ", userId);
  } catch (error) {
    console.error("Error deleting stream user", error);
  }
};

// todo: another method to generateToken
