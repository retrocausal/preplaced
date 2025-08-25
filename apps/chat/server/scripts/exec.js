// updateTimestamps.ts
import mongoose from "mongoose";
import { Schema } from "#db/db"; // Adjust path to your db.ts

const MONGODB_URI =
  "mongodb://cappAdmin:077cbb0805b6ed873d62a6c44373b201@localhost:27017/chatdb?authSource=chatdb"; // From .env

// Function to generate random past timestamp in a given year
function randomPastTimestamp(year) {
  const now = new Date(); // August 23, 2025
  let maxMs = now.getTime(); // Current timestamp in ms
  let minMs;

  if (year === 2025) {
    minMs = new Date(2025, 0, 1).getTime(); // Jan 1, 2025
  } else {
    minMs = new Date(2024, 0, 1).getTime(); // Jan 1, 2024
    const end2024 = new Date(2024, 11, 31, 23, 59, 59).getTime();
    if (maxMs > end2024) maxMs = end2024; // Cap at Dec 31, 2024
  }

  const randomMs = minMs + Math.random() * (maxMs - minMs);
  return new Date(randomMs);
}

async function updateTimestamps() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const chats = await Schema.Chat.find().populate("messages");

    for (const chat of chats) {
      const messages = chat.messages;
      if (messages.length < 2) {
        console.log(`Chat ${chat._id} has less than 2 messages, skipping`);
        continue;
      }

      // Ensure at least 2 messages with 2024 timestamps
      for (let i = 0; i < 2; i++) {
        const message = messages[i];
        message.timestamp = randomPastTimestamp(2024);
        await message.save();
      }

      // Mix 2024 and 2025 for remaining messages
      for (let i = 2; i < messages.length; i++) {
        const message = messages[i];
        const year = Math.random() < 0.5 ? 2024 : 2025;
        message.timestamp = randomPastTimestamp(year);
        await message.save();
      }

      console.log(`Updated timestamps for chat ${chat._id}`);
    }

    console.log("All timestamps updated");
  } catch (error) {
    console.error("Error updating timestamps:", error);
  } finally {
    await mongoose.disconnect();
  }
}

updateTimestamps();
