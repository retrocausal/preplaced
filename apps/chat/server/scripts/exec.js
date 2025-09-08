// scripts/addDisplayNames.js
import mongoose from "mongoose";
import { Schema } from "#db/db";
import { faker } from "@faker-js/faker";

async function addDisplayNames() {
  try {
    await mongoose.connect(
      "mongodb://cappAdmin:077cbb0805b6ed873d62a6c44373b201@localhost:27017/chatdb?authSource=chatdb"
    );
    console.log("Connected to MongoDB");

    const users = await Schema.User.find();
    for (const user of users) {
      let displayName = faker.internet.userName().substring(0, 24);
      if (displayName.length < 5)
        displayName += Math.floor(Math.random() * 1000)
          .toString()
          .padStart(5 - displayName.length, "0");
      user.displayName = displayName;
      await user.save();
      console.log(`Added displayName ${displayName} to user ${user.username}`);
    }

    console.log(`Updated ${users.length} users`);
  } catch (error) {
    console.error("Error adding display names:", error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

addDisplayNames();
