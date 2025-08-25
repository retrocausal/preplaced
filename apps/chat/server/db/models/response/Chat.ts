export interface ChatList {
  chats: {
    _id: string;
    messageCount: number;
    participantCount: number;
    members: string[];
    conversations: {
      text: string;
      epoch?: { formatted: string; timestamp: number };
      authorName: string;
      edited?: boolean;
      readBy?: string[];
    }[];
  }[];
  total: number;
}
