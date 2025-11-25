// test/setup.ts
// Global test setup: In-memory MongoDB, env vars, DB connection, cleanup

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import connection from "#db/db"; // Adjust path if your project structure differs

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // Start in-memory MongoDB
  mongoServer = await MongoMemoryServer.create({
    instance: {
      port: 27017, // Fixed port for consistency (or omit for random)
    },
  });

  // Set test env vars (override .env)
  process.env.MONGODB_URI = mongoServer.getUri();
  process.env.COOKIE_SECRET = "test-cookie-secret";
  process.env.JWT_SECRET = "test-jwt-secret";
  process.env.AUTH_TTL = "1"; // Short TTL for tests
  process.env.PORT = "0"; // Random port for app.listen in tests

  // Connect to in-memory DB (uses your db/db.ts logic)
  await connection;
  console.log("In-memory MongoDB started and connected");
});

beforeEach(async () => {
  // Clean DB state before each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  // Cleanup after all tests
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
  console.log("In-memory MongoDB stopped");
});
