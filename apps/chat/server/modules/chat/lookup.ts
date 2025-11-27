// Participants lookup stage
export const participantsLookup = {
  $lookup: {
    from: 'users',
    localField: 'participants',
    foreignField: '_id',
    as: 'participants',
    // Project usernames, displayName, and _id for comparison in deriveChatFields
    pipeline: [{ $project: { username: 1, displayName: 1, _id: 1 } }],
  },
};

// Conversations (messages) lookup stage with sub-pipeline

export const conversationsLookup = (limit: number = 10, offset: number = 0, cursor?: number) => {
  return {
    $lookup: {
      from: 'messages',
      localField: 'messages',
      foreignField: '_id',
      as: 'conversations',
      pipeline: [
        {
          $match: cursor ? { timestamp: { $lt: new Date(cursor) } } : {},
        },
        // Initial sort descending for latest first
        {
          $sort: { timestamp: -1 as -1 },
        },
        // Apply offset
        {
          $skip: offset,
        },
        // Restrict to conversationLimit messages
        {
          $limit: limit,
        },
        // Re-sort ascending for chronological order
        {
          $sort: { timestamp: 1 as 1 },
        },
        // Join author user details
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
            as: 'author',
            // Project only usernames and displayName
            pipeline: [{ $project: { username: 1, displayName: 1, _id: 0 } }],
          },
        },
        // Flatten author array to single object
        {
          $unwind: '$author',
        },
        // Join viewedBy user details
        {
          $lookup: {
            from: 'users',
            localField: 'viewedBy',
            foreignField: '_id',
            as: 'viewedBy',
            // Project only usernames and displayName
            pipeline: [{ $project: { username: 1, displayName: 1, _id: 0 } }],
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
};
