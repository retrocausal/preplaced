// db/models/types.ts
import { Document, Types } from "mongoose";

export interface UserDocument extends Document {
  username: string;
  password: string;
  displayName: string;
  chatCount: number;
  validateUser(password: string): Promise<boolean>;
  generateAuthToken(): string;
}

export interface MessageDocument extends Document {
  author: Types.ObjectId | UserDocument;
  authorName?: string;
  text: string;
  timestamp: Date;
  edited: boolean;
  epoch?: { formatted: string; timestamp: number };
  viewedBy: Types.ObjectId[] | UserDocument[];
  readBy?: string[];
}

export interface ChatDocument extends Document {
  participants: Types.ObjectId[] | UserDocument[];
  previousParticipants: Types.ObjectId[];
  messages: Types.ObjectId[] | MessageDocument[];
  messageCount: number;
  createdAt: Date;
  conversations?: MessageDocument[];
  participantCount: number;
  members?: string[]; // Added to match schema's virtual
}
