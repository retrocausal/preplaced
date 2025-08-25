// Import Mongoose with types
import mongoose from "mongoose";
import { MessageDocument } from "#models/types";
import { formatEpoch } from "#utils/formatters";

// Define schema with fields and options
const schema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Reference to the User model for population
    }, // Unique identifier linking to a User document
    text: {
      type: mongoose.Schema.Types.String,
      required: true,
      maxLength: 2400,
    }, // Message content, mandatory
    timestamp: { type: Date, default: Date.now }, // Date of message creation, defaults to current time
    edited: { type: Boolean, default: false }, // Flag indicating if message was edited, defaults to false
    viewedBy: [
      { type: mongoose.Schema.Types.ObjectId, default: [], ref: "User" },
    ], // Array of user IDs who viewed the message, defaults to empty array
  },
  {
    id: false, // Disable automatic creation of id field
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete (ret as Partial<typeof ret>).author; // Remove author from JSON output
        delete (ret as Partial<typeof ret>).viewedBy;
        delete (ret as Partial<typeof ret>).timestamp;
        return ret;
      },
    }, // Include virtual fields in JSON output
    toObject: { virtuals: true }, // Include virtual fields in object conversion
  } // Schema options to enable virtual field computation
);

// Add index for performance optimization
schema.index({ author: 1 }); // Index on author field to speed up queries by author
schema.index({ timestamp: -1 });
schema.index({ viewedBy: 1 });

schema.virtual("authorName").get(function (this: MessageDocument) {
  if (
    this.populated("author") &&
    this.author &&
    typeof this.author === "object" &&
    "username" in this.author
  ) {
    return this.author.username; // Return author's username if available
  }
});

// Define virtual field for custom epoch formatting
schema.virtual("epoch").get(function (this: MessageDocument) {
  return formatEpoch(this.timestamp);
});

schema.virtual("readBy").get(function (this: MessageDocument) {
  if (
    this.populated("viewedBy") &&
    this.viewedBy &&
    Array.isArray(this.viewedBy)
  ) {
    return this.viewedBy.map((v) =>
      typeof v === "object" && "username" in v ? v.username : `${v}`
    ); // Return author's username if available
  }
});

// Export Message model with interface
export default mongoose.model<MessageDocument>("Message", schema);
