// lookups/chat.ts
// Participants lookup stage
export const participantsLookup = {
	$lookup: {
		from: "users",
		localField: "participants",
		foreignField: "_id",
		as: "participants",
		// Project only usernames
		pipeline: [{ $project: { username: 1, _id: 0 } }],
	},
};

// Conversations (messages) lookup stage with sub-pipeline
export const conversationsLookup = {
	$lookup: {
		from: "messages",
		localField: "messages",
		foreignField: "_id",
		as: "conversations",
		pipeline: [
			// Initial sort descending for latest first
			{
				$sort: { timestamp: -1 as -1 },
			},
			// Restrict to last 10 messages
			{
				$limit: 10,
			},
			// Re-sort ascending for chronological order
			{
				$sort: { timestamp: 1 as 1 },
			},
			// Join author user details
			{
				$lookup: {
					from: "users",
					localField: "author",
					foreignField: "_id",
					as: "author",
					// Project only usernames
					pipeline: [{ $project: { username: 1, _id: 0 } }],
				},
			},
			// Flatten author array to single object
			{
				$unwind: "$author",
			},
			// Join viewedBy user details
			{
				$lookup: {
					from: "users",
					localField: "viewedBy",
					foreignField: "_id",
					as: "viewedBy",
					// Project only usernames
					pipeline: [{ $project: { username: 1, _id: 0 } }],
				},
			},
			// Select raw message fields before top-level derivations
			{
				$project: {
					text: 1,
					timestamp: 1,
					edited: 1,
					author: 1,
					viewedBy: 1,
				},
			},
		],
	},
};
