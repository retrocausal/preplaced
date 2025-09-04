// scripts/recreateCollections.js
import mongoose from "mongoose";
import { Schema } from "#db/db";
import { faker } from "@faker-js/faker";

async function recreateCollections() {
  try {
    await mongoose.connect(
      "mongodb://cappAdmin:077cbb0805b6ed873d62a6c44373b201@localhost:27017/chatdb?authSource=chatdb"
    );
    console.log("Connected to MongoDB");

    // Create testuser1 and testuser2
    const user1 = new Schema.User({
      username: "testuser1",
      password: "testpassword",
      chatCount: 0,
    });
    await user1.save();
    console.log("Created testuser1");

    const user2 = new Schema.User({
      username: "testuser2",
      password: "testpassword",
      chatCount: 0,
    });
    await user2.save();
    console.log("Created testuser2");

    // Create 12 additional users
    const users = [];
    for (let i = 0; i < 12; i++) {
      let username = faker.internet.userName().substring(0, 24);
      if (username.length < 5)
        username += i.toString().padStart(5 - username.length, "0");
      const user = new Schema.User({
        username,
        password: "testpassword",
        chatCount: 0,
      });
      await user.save();
      users.push(user);
      console.log(`Created user: ${user.username}`);
    }

    const allUsers = [user1, user2, ...users];

    // Create 5 chats
    for (let i = 0; i < 5; i++) {
      const otherUsers = allUsers
        .filter((u) => u.username !== "testuser1")
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 1);

      const chatParticipants = [user1._id, ...otherUsers.map((u) => u._id)];
      const chat = new Schema.Chat({
        participants: chatParticipants,
        previousParticipants: [],
        messages: [],
        messageCount: 0,
        createdAt: new Date(),
        participantCount: chatParticipants.length,
      });

      // Add 8-10 messages per chat
      const messageCount = Math.floor(Math.random() * 3) + 8;
      const messages = [];
      const timestamps = [];
      for (let j = 0; j < 3; j++) {
        timestamps.push(
          new Date(
            2024,
            Math.floor(Math.random() * 8), // Jan-Aug 2024
            Math.floor(Math.random() * 28) + 1,
            Math.floor(Math.random() * 24),
            Math.floor(Math.random() * 60)
          )
        );
      }
      for (let j = 3; j < messageCount; j++) {
        const year = Math.random() > 0.5 ? 2024 : 2023;
        const month =
          year === 2024
            ? Math.floor(Math.random() * 8)
            : Math.floor(Math.random() * 12);
        timestamps.push(
          new Date(
            year,
            month,
            Math.floor(Math.random() * 28) + 1,
            Math.floor(Math.random() * 24),
            Math.floor(Math.random() * 60)
          )
        );
      }

      for (let j = 0; j < messageCount; j++) {
        const author =
          chatParticipants[Math.floor(Math.random() * chatParticipants.length)];
        const message = new Schema.Message({
          author,
          text: faker.lorem.sentence().substring(0, 2400),
          timestamp: timestamps[j],
          edited: false,
          viewedBy: [],
        });
        await message.save();
        messages.push(message._id);
      }

      chat.messages = messages;
      chat.messageCount = messages.length;
      await chat.save();
      console.log(
        `Created chat ${i + 1} with ${
          chatParticipants.length
        } participants and ${messageCount} messages`
      );

      await Schema.User.updateMany(
        { _id: { $in: chatParticipants } },
        { $inc: { chatCount: 1 } }
      );
      console.log(`Updated chatCount for chat ${i + 1}`);
    }

    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "Collections in chatdb:",
      collections.map((c) => c.name)
    );
    console.log("Total users:", await Schema.User.countDocuments());
    console.log("Total chats:", await Schema.Chat.countDocuments());
    console.log("Total messages:", await Schema.Message.countDocuments());
  } catch (error) {
    console.error("Error recreating collections:", error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

recreateCollections();
