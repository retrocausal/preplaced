import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { Schema } from "#db/db";
import bcrypt from "bcryptjs";

// Function to generate random unique username
async function generateUniqueUsername() {
  let username = faker.internet.userName();
  while (await Schema.User.findOne({ username })) {
    username = faker.internet.userName();
  }
  return username;
}

// Function to generate random date between June 1, 2024, and October 7, 2025
function getRandomDate() {
  const start = new Date(2024, 5, 1).getTime(); // June 1, 2024
  const end = new Date(2025, 9, 7).getTime(); // October 7, 2025
  return new Date(start + Math.random() * (end - start));
}

// Main async function to reassign usernames, create chats, and add messages
async function generateTestData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      "mongodb://cappAdmin:077cbb0805b6ed873d62a6c44373b201@localhost:27017/chatdb?authSource=chatdb",
      {
        maxPoolSize: 15,
      }
    );
    console.log("Connected to MongoDB");

    // Find testuser1
    const testUser = await Schema.User.findOne({ username: "testuser1" });
    if (!testUser) {
      console.log("testuser1 not found. Creating it.");
      const hashedPassword = await bcrypt.hash("password", 10);
      testUser = new Schema.User({
        username: "testuser1",
        displayName: "Test User 1",
        password: hashedPassword,
        chatCount: 0,
      });
      await testUser.save();
      console.log("testuser1 created");
    } else {
      console.log("testuser1 found");
    }

    // Find all users except testuser1
    const users = await Schema.User.find({ username: { $ne: "testuser1" } });
    console.log(`Found ${users.length} users to process`);

    for (const user of users) {
      // Reassign username if needed, ensure unique
      const newUsername = await generateUniqueUsername();
      user.username = newUsername;
      await user.save();
      console.log(`Reassigned username for user ${user._id} to ${newUsername}`);

      // Create chat with user and testuser1
      let chat = await Schema.Chat.findOne({
        participants: { $all: [user._id, testUser._id], $size: 2 },
      });

      if (!chat) {
        chat = new Schema.Chat({
          participants: [user._id, testUser._id],
        });
        await chat.save();
        console.log(
          `Created new chat ${chat._id} between ${newUsername} and testuser1`
        );
      } else {
        console.log(
          `Existing chat ${chat._id} found between ${newUsername} and testuser1`
        );
      }

      // Ensure at least 60 messages in the chat
      let currentMessages = chat.messages.length;
      const numMessagesToAdd = Math.max(60 - currentMessages, 0);
      if (numMessagesToAdd > 0) {
        const timestamps = [];
        for (let i = 0; i < numMessagesToAdd; i++) {
          let newTimestamp;
          do {
            newTimestamp = getRandomDate();
          } while (timestamps.includes(newTimestamp.getTime()));
          timestamps.push(newTimestamp.getTime());
        }
        timestamps.sort((a, b) => a - b);

        const newMessageIds = [];

        for (let i = 0; i < numMessagesToAdd; i++) {
          // Random author from participants
          const authorIndex = Math.floor(Math.random() * 2);
          const author = [user._id, testUser._id][authorIndex];

          // Random text using faker
          const text = faker.lorem.sentence();

          // Create message
          const message = new Schema.Message({
            author,
            text,
            timestamp: new Date(timestamps[i]),
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
        console.log(`Added ${numMessagesToAdd} messages to chat ${chat._id}`);
      } else {
        console.log(`Chat ${chat._id} already has at least 60 messages`);
      }

      // Ensure unique timestamps in the chat
      const chatMessages = await Schema.Message.find({
        _id: { $in: chat.messages },
      }).select("timestamp");
      const timestampSet = new Set(
        chatMessages.map((m) => m.timestamp.getTime())
      );
      if (timestampSet.size < chatMessages.length) {
        console.log(`Found duplicates in chat ${chat._id}. Resolving...`);
        const sortedMessages = chatMessages.sort(
          (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
        );
        let currentTime = sortedMessages[0].timestamp.getTime();

        for (let i = 1; i < sortedMessages.length; i++) {
          currentTime += 1000; // Add 1 second to make unique
          if (currentTime > maxDate.getTime()) {
            currentTime = getRandomDate().getTime();
          }
          await Schema.Message.updateOne(
            { _id: sortedMessages[i]._id },
            { timestamp: new Date(currentTime) }
          );
        }
        console.log(`Resolved duplicates in chat ${chat._id}`);
      }
    }

    console.log("All users, chats, and messages processed successfully");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the function
generateTestData();
