// routes.ts
// Import types and modules
import express, { Router } from "express";
import { login, logout } from "#middlewares/Auth";
import { fetchChats } from "#middlewares/Chat/aggregator";
import { fetchConversations } from "#middlewares/Chat/conversations";
import {
  validateChatQuery,
  validateFetchConversationsQuery,
} from "#middlewares/Chat/validators"; // Your new middleware

// Create router instance
const router: Router = express.Router();

// Define routes
router.post("/auth/login", login);
router.post("/auth/logout", logout);
router.get("/list/", validateChatQuery, fetchChats); // Add validator before handler
router.get(
  "/conversation",
  validateFetchConversationsQuery,
  fetchConversations
);

// Export router
export default router;
