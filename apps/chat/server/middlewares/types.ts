import mongoose from "mongoose";

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
