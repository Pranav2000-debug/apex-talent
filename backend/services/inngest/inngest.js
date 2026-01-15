import { Inngest } from "inngest";
import { connectDB } from "../../db/connectDB.js";
import { User } from "../../models/User.model.js";
import { deleteStreamUser, upsertStreamUser } from "../stream/stream.js";

export const inngest = new Inngest({ id: "apex-talent" });

const syncUser = inngest.createFunction({ id: "sync-user" }, { event: "clerk/user.created" }, async ({ event }) => {
  await connectDB();

  const { id, email_addresses, first_name, last_name, image_url } = event.data;

  // safer to with inngest retries
  // when upsert is true, creates new if not existing
  const newUser = await User.findOneAndUpdate(
    { clerkId: id },
    {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`,
      profileImage: image_url,
    },
    {
      upsert: true,
      new: true,
    }
  );

  await upsertStreamUser({
    id: newUser.clerkId.toString(),
    name: newUser.name,
    image: newUser.profileImage,
  });
});

const deleteUserFromDB = inngest.createFunction({ id: "delete-user-from-db" }, { event: "clerk/user.deleted" }, async ({ event }) => {
  await connectDB();

  const { id } = event.data;

  await User.deleteOne({ clerkId: id });

  // todo: do sthe
  await deleteStreamUser(id.toString());
});

export const functions = [syncUser, deleteUserFromDB];
