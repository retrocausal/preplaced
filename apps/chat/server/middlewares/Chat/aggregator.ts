import { Request, Response, NextFunction } from "express";
import { Schema } from "#db/db";
import { ChatList } from "#models/response/Chat";
import { ChatListRequest } from "#models/request/Chat";
import mongoose from "mongoose";
import { ChatAggregationResult } from "#middlewares/types";
import {
  participantsLookup,
  conversationsLookup,
} from "#middlewares/lookups/chat";
import { deriveChatFields } from "#middlewares/derivations/chat";
import { finalChatProject } from "#middlewares/projections/chat";

export const fetchChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, limit, page, lazy } = req.validatedQuery as ChatListRequest;
  const total = await Schema.Chat.countDocuments({ participants: userId });
  const fetchLimit = lazy ? limit : total || limit;
  const offset = (page - 1) * fetchLimit;
  const conversationLimit: number = 10;
  const conversationoffset = 0;

  try {
    const conversations: ChatAggregationResult[] = await Schema.Chat.aggregate([
      // Filter chats by participant userId
      {
        $match: { participants: new mongoose.Types.ObjectId(userId) },
      },
      // Set currentUserId for use in deriveChatFields to replace matching participant's name with "you"
      {
        $set: {
          currentUserId: userId,
        },
      },
      // Apply pagination offset
      {
        $skip: offset,
      },
      // Limit results based on lazy or total count
      {
        $limit: fetchLimit,
      },
      { ...participantsLookup },
      { ...conversationsLookup(conversationLimit, conversationoffset) },
      { ...deriveChatFields },
      { ...finalChatProject },
    ]);

    // Sort results by last message timestamp (descending)
    const chats = conversations.sort((a, b) => {
      const aConvos = a.conversations || [];
      const bConvos = b.conversations || [];
      const first = aConvos[aConvos.length - 1]?.epoch.timestamp || 0;
      const second = bConvos[bConvos.length - 1]?.epoch.timestamp || 0;
      return second - first;
    });

    res.json({ chats, total } as ChatList);
  } catch (error: unknown) {
    next(error);
  }
};
