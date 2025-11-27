// routes.ts
// Import types and modules
import express, { Router } from 'express';
import { login, logout } from '#modules/auth/controller';
import { fetchChats } from '#modules/chat/controller';
import { fetchConversations } from '#modules/messages/controller';
import { validateChatQuery } from '#modules/chat/validations';
import { validateFetchConversationsQuery } from '#modules/messages/validations';

// Create router instance
const router: Router = express.Router();

// Define routes
router.post('/auth/login', login);
router.post('/auth/logout', logout);
router.get('/list/', validateChatQuery, fetchChats); // Add validator before handler
router.get('/conversation', validateFetchConversationsQuery, fetchConversations);

// Export router
export default router;
