import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./db/connectDB.js";
import { User } from "./models/User.model.js";

dotenv.config({ quiet: true });
const port = process.env.PORT || 8080;

connectDB()
  .then(() => {
    User.syncIndexes();
    app.listen(port, () => {
      console.log(`server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error", err);
    process.exit(1);
  });
