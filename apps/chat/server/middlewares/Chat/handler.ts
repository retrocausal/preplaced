// handler.ts
import { Request, Response, NextFunction } from "express";
import { Schema } from "#db/db";
import { ChatList } from "#models/response/Chat";
import { ChatListRequest } from "#models/request/Chat";

export const fetchChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, limit, page, lazy } = req.validatedQuery as ChatListRequest;
  const total = await Schema.Chat.countDocuments({ participants: userId });
  const fetchLimit = lazy ? limit : total || limit;
  const offset = (page - 1) * fetchLimit;

  try {
    const conversations = await Schema.Chat.find({ participants: userId })
      .skip(offset)
      .limit(fetchLimit)
      .populate("participants", "username -_id")
      .populate({
        path: "messages",
        select: "text timestamp epoch author",
        options: { virtuals: true, sort: { timestamp: -1 }, limit: 10 },
        populate: [
          { path: "author", select: "username -_id" },
          { path: "viewedBy", select: "username, -_id" },
        ],
      })
      .exec();

    const chats = conversations
      .map((c) => {
        const chat = c.toJSON();
        return { ...chat, _id: `${c._id}` as string };
      })
      .sort((a, b) => {
        const aConvos = a.conversations || [];
        const bConvos = b.conversations || [];
        const first = aConvos[aConvos.length - 1];
        const second = bConvos[bConvos.length - 1];
        return (second?.epoch?.timestamp || 0) - (first?.epoch?.timestamp || 0);
      });

    res.status(200).json({ chats, total } as ChatList);
  } catch (error: unknown) {
    next(error);
  }
};

export default fetchChats;
