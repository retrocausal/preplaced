// Import Mongoose with types
import mongoose from 'mongoose';
import 'dotenv/config';
// Import schema definitions
import userSchema from '#modules/user/model';
import messageSchema from '#modules/messages/model';
import chatSchema from '#modules/chat/model';
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
