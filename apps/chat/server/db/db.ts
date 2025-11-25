// Import Mongoose with types
import mongoose from "mongoose";
import "dotenv/config";
// Import schema definitions
import userSchema from "#models/User";
import messageSchema from "#models/Message";
import chatSchema from "#models/Chat";
// Connect to MongoDB
const db = mongoose.connect(process.env.MONGODB_URI as string, {
  maxPoolSize: 15,
});

export default db;
export const Schema = {
  User: userSchema,
  Message: messageSchema,
  Chat: chatSchema,
};
