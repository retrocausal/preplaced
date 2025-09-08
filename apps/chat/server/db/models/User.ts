// Import Mongoose and bcryptjs
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { UserDocument } from "#models/types";

// Define schema
const schema = new mongoose.Schema({
  username: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
    minLength: 5,
    maxLength: 24,
  },
  displayName: {
    type: mongoose.Schema.Types.String,
    required: true,
    minLength: 5,
    maxLength: 24,
  },
  password: { type: mongoose.Schema.Types.String, required: true },
  chatCount: { type: mongoose.Schema.Types.Number, default: 0 },
});

// Hash password before saving with error handling
schema.pre("save", async function (this: UserDocument, next) {
  try {
    if (this.isModified("password"))
      this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err as Error);
  }
});

// Method to validate password
schema.methods.validateUser = async function (
  this: UserDocument,
  password: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    throw new Error("Password validation failed: " + (err as Error).message);
  }
};

// Placeholder method to generate JWT token
schema.methods.generateAuthToken = function (this: UserDocument): string {
  throw new Error("generateAuthToken not implemented yet");
};

// Export User model with interface
export default mongoose.model<UserDocument>("User", schema);
