import { Request, Response, NextFunction } from 'express';
import { GetConversationsReq } from '#definitions/request/conversations';
import { ChatAggregationResult } from '#definitions/response/chat';
import { conversationsLookup } from '#modules/chat/lookup';
import { deriveChatFields } from '#modules/chat/derivation';
import { Schema } from '#db/db';
import mongoose from 'mongoose';
type Conversations = ChatAggregationResult['conversations'];

export const fetchConversations = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.query;
  const { id, limit, page, cursor } = req.validatedQuery as GetConversationsReq;
  const conversationId = new mongoose.Types.ObjectId(id);
  let messages: Partial<ChatAggregationResult>[] = [];
  let offset = 0;

  if (page) {
    offset = (page - 1) * limit;
  }

  try {
    messages = await Schema.Chat.aggregate([
      { $match: { _id: conversationId } },
      {
        $set: {
          currentUserId: userId,
        },
      },
      { ...conversationsLookup(limit, offset, cursor) },
      {
        $addFields: {
          conversations: { ...deriveChatFields.$addFields.conversations },
        },
      },
      {
        $project: {
          conversations: 1,
        },
      },
    ]);
    let conversations: Conversations | void[] = messages.pop()?.conversations || [];
    res.json({ conversations });
  } catch (error: unknown) {
    next(error);
  }
};
