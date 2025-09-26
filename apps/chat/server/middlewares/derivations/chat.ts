// Derivation stage for chat fields after lookups
export const deriveChatFields = {
  $addFields: {
    // Map participants to usernames for members
    members: {
      $map: {
        input: "$participants",
        as: "participant",
        in: {
          $ifNull: ["$$participant.displayName", "$$participant.username"],
        },
      },
    },
    title: {
      $cond: {
        if: { $gt: [{ $size: "$participants" }, 0] },
        then: {
          $reduce: {
            input: {
              $map: {
                input: "$participants",
                as: "participant",
                in: {
                  $cond: {
                    if: {
                      $eq: [
                        "$$participant._id",
                        { $toObjectId: "$currentUserId" },
                      ],
                    },
                    then: "You",
                    else: {
                      $ifNull: [
                        "$$participant.displayName",
                        "$$participant.username",
                      ],
                    },
                  },
                },
              },
            },
            initialValue: "",
            in: {
              $concat: [
                "$$value",
                { $cond: [{ $eq: ["$$value", ""] }, "", ", "] },
                "$$this",
              ],
            },
          },
        },
        else: "Untitled Chat",
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
          authorName: "$$conv.author.displayName",
          readBy: {
            $map: {
              input: "$$conv.viewedBy",
              as: "viewer",
              in: "$$viewer.displayName",
            },
          },
          epoch: {
            $let: {
              vars: {
                year: { $year: { date: "$$NOW", timezone: "Asia/Kolkata" } },
                month: { $month: { date: "$$NOW", timezone: "Asia/Kolkata" } },
                tsYear: {
                  $year: { date: "$$conv.timestamp", timezone: "Asia/Kolkata" },
                },
                tsMonth: {
                  $month: {
                    date: "$$conv.timestamp",
                    timezone: "Asia/Kolkata",
                  },
                },
                timeStr: {
                  $dateToString: {
                    date: "$$conv.timestamp",
                    format: "%H:%M",
                    timezone: "Asia/Kolkata",
                  },
                },
                weekdayArray: [
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ],
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
