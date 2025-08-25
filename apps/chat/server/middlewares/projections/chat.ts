// projections/chat.ts
// Final projection stage for chat output
export const finalChatProject = {
	$project: {
		_id: { $toString: "$_id" }, // Coerce ObjectId to string
		messageCount: 1,
		participantCount: 1,
		members: 1,
		conversations: 1,
	},
};
