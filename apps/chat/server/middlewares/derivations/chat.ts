// derivations/chat.ts
// Derivation stage for chat fields after lookups
export const deriveChatFields = {
	$addFields: {
		// Map participants to usernames for members
		members: {
			$map: {
				input: "$participants",
				as: "participant",
				in: "$$participant.username",
			},
		},
		// Derive per-message fields using $map on conversations
		conversations: {
			$map: {
				input: "$conversations",
				as: "conv",
				in: {
					text: "$$conv.text",
					edited: "$$conv.edited",
					authorName: "$$conv.author.username",
					readBy: {
						$map: {
							input: "$$conv.viewedBy",
							as: "viewer",
							in: "$$viewer.username",
						},
					},
					epoch: {
						$let: {
							vars: {
								year: { $year: { date: "$$NOW", timezone: "Asia/Kolkata" } }, // Current year in timezone
								month: { $month: { date: "$$NOW", timezone: "Asia/Kolkata" } }, // Current month in timezone
								tsYear: {
									$year: { date: "$$conv.timestamp", timezone: "Asia/Kolkata" },
								}, // Timestamp year
								tsMonth: {
									$month: {
										date: "$$conv.timestamp",
										timezone: "Asia/Kolkata",
									},
								}, // Timestamp month
								timeStr: {
									$dateToString: {
										date: "$$conv.timestamp",
										format: "%H:%M",
										timezone: "Asia/Kolkata",
									},
								},
								weekdayArray: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], // Array for weekday lookup
							},
							in: {
								formatted: {
									$cond: {
										if: { $ne: ["$$tsYear", "$$year"] },
										then: {
											$concat: [
												{
													$dateToString: {
														date: "$$conv.timestamp",
														format: "%b %d %Y",
														timezone: "Asia/Kolkata",
													},
												},
												", ",
												"$$timeStr",
											],
										},
										else: {
											$cond: {
												if: { $ne: ["$$tsMonth", "$$month"] },
												then: {
													$concat: [
														{
															$dateToString: {
																date: "$$conv.timestamp",
																format: "%b %d",
																timezone: "Asia/Kolkata",
															},
														},
														", ",
														"$$timeStr",
													],
												},
												else: {
													$concat: [
														{
															$arrayElemAt: [
																"$$weekdayArray",
																{
																	$subtract: [
																		{
																			$dayOfWeek: {
																				date: "$$conv.timestamp",
																				timezone: "Asia/Kolkata",
																			},
																		},
																		1,
																	],
																},
															],
														},
														", ",
														"$$timeStr",
													],
												},
											},
										},
									},
								},
								timestamp: { $toLong: "$$conv.timestamp" },
							},
						},
					},
				},
			},
		},
	},
};
