export interface ChatList {
  chats: {
    _id: string;
    title: string;
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

export interface ChatAggregationResult {
  _id: string;
  messageCount: number;
  participantCount: number;
  members: string[];
  conversations: {
    text: string;
    edited: boolean;
    authorName: string;
    readBy: string[];
    epoch: {
      formatted: string;
      timestamp: number;
    };
  }[];
}
