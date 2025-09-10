import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { Schema } from "#db/db";

// Function to generate random date in 2025 up to Sep 10
function getRandomDate() {
  const start = new Date(2025, 0, 1).getTime(); // Jan 1, 2025
  const end = new Date(2025, 8, 10).getTime(); // Sep 10, 2025
  return new Date(start + Math.random() * (end - start));
}

// Main async function to add messages to chats
async function addMessagesToChats() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      "mongodb://cappAdmin:077cbb0805b6ed873d62a6c44373b201@localhost:27017/chatdb?authSource=chatdb",
      {
        maxPoolSize: 15,
      }
    );
    console.log("Connected to MongoDB");

    // Find all chats
    const chats = await Schema.Chat.find({});
    console.log(`Found ${chats.length} chats`);

    for (const chat of chats) {
      if (chat.participants.length < 2) {
        console.log(`Skipping chat ${chat._id} with fewer than 2 participants`);
        continue;
      }

      // Determine number of messages to add: 5 or 6
      const numMessages = Math.random() < 0.5 ? 5 : 6;

      // Generate sorted timestamps
      const timestamps = Array.from(
        { length: numMessages },
        getRandomDate
      ).sort((a, b) => a - b);

      const newMessageIds = [];

      for (let i = 0; i < numMessages; i++) {
        // Random author from participants
        const authorIndex = Math.floor(
          Math.random() * chat.participants.length
        );
        const author = chat.participants[authorIndex];

        // Random text using faker
        const text = faker.lorem.sentence();

        // Create message
        const message = new Schema.Message({
          author,
          text,
          timestamp: timestamps[i],
          edited: false,
          viewedBy: [], // Empty for simplicity
        });

        await message.save();
        newMessageIds.push(message._id);
      }

      // Add new messages to chat
      chat.messages.push(...newMessageIds);
      chat.messageCount = chat.messages.length;

      // Save chat (triggers pre-save hooks to update counts)
      await chat.save();
      console.log(`Added ${numMessages} messages to chat ${chat._id}`);
    }

    console.log("All chats updated successfully");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the function
addMessagesToChats();
