// server/scripts/seedMeaningfulChatHistory.js
// Run with: node --experimental-modules server/scripts/seedMeaningfulChatHistory.js
// OR better: add "type": "module" in package.json and just run node server/scripts/seedMeaningfulChatHistory.js
// WARNING: DELETES ALL EXISTING MESSAGES AND REBUILDS FROM SCRATCH

import mongoose from "mongoose";
// import User from "#models/User";
// import Message from "#models/Message";
// import Chat from "#db/models/Chat";

import { Schema } from "#db/db";
const User = Schema.User;
const Message = Schema.Message;
const Chat = Schema.Chat;

const SPECIAL_USER_ID = new mongoose.Types.ObjectId("68b2f6fd2f357daf03e1e073");

const realisticMessages = [
  "Hey, how's your day going?",
  "Pretty good so far, thanks! Yours?",
  "Not bad, just finished a meeting. Coffee helped.",
  "Same here, caffeine is life.",
  "Have you eaten lunch yet?",
  "Yeah, grabbed a sandwich. You?",
  "Still deciding what to have.",
  "There's a new place nearby if you want to try it sometime.",
  "I'm in, when are you free?",
  "How about Friday afternoon?",
  "Perfect, let's do 2pm.",
  "Sounds good, see you then!",
  "Did you see the news this morning?",
  "Yeah, wild stuff.",
  "Right? Can't believe it.",
  "How's work lately?",
  "Busy but good. New project.",
  "Nice! What's it about?",
  "Can't say yet, exciting though.",
  "Keeping secrets now? 😄",
  "Haha, you'll know soon.",
  "Remember that restaurant last year?",
  "Best pizza ever.",
  "They're opening downtown.",
  "No way, we have to go.",
  "Game tonight?",
  "Wouldn't miss it. Coming over?",
  "On my way!",
  "How's the family?",
  "Everyone's good, thanks.",
  "Kids keeping you busy?",
  "You have no idea 😂",
  "Tell me about it.",
  "Holiday plans?",
  "Beach this year. You?",
  "Mountains, need quiet.",
  "Jealous, sounds perfect.",
  "Read any good books?",
  "Just finished a thriller.",
  "Send the name?",
  "'The Silent Patient'.",
  "Added, thanks!",
  "How's the new job?",
  "Loving it, great team.",
  "Happy for you!",
  "We should catch up soon.",
  "Totally, been too long.",
  "Coffee next week?",
  "Yes please!",
  "Weather where you are?",
  "Finally cooling down.",
  "Same, loving it.",
  "Perfect running weather.",
  "You're still running? Impressive.",
  "Join sometime?",
  "Deal.",
  "How did the exam go?",
  "Aced it.",
  "Knew you would! Proud.",
  "Thanks, means a lot.",
  "Weekend plans?",
  "Chilling, movie night.",
  "Want company?",
  "Always.",
  "New recipe to try.",
  "Tell me.",
  "Healthier butter chicken.",
  "Making me hungry.",
  "I'll send photos.",
  "Please do!",
  "Week looking busy?",
  "Back-to-back calls.",
  "Hang in there.",
  "Counting hours.",
  "Booked flights December.",
  "Where to?",
  "Goa with family.",
  "Amazing, have fun!",
  "Thanks! Visit next time.",
  "Would love that.",
  "Saw your new car post, sick!",
  "Thanks, loving it.",
  "When do I get a ride?",
  "Anytime.",
  "Coffee machine?",
  "Best purchase ever.",
  "Told you!",
  "Finally admitting I was right 😏",
  "Never doubted.",
  "Golf Saturday?",
  "Wouldn't miss it.",
  "Weather looks perfect.",
  "See you there.",
  "Finished workout.",
  "Feeling good?",
  "Endorphins kicking in.",
  "Keep it up!",
  "Diet going?",
  "Down 4kg.",
  "Legend! Proud.",
  "Your tips helped.",
  "Anytime.",
  "New Netflix show insane.",
  "Which one?",
  "The heist one.",
  "Binged last week.",
  "Ending wild?",
  "Mind blown.",
  "Need season 2.",
  "Agreed.",
  "How's your mom?",
  "Much better, thanks.",
  "Relieved.",
  "She says hi.",
  "Hi back!",
  "Thinking of getting a dog.",
  "Do it! Best decision.",
  "Breed?",
  "Golden retriever.",
  "Perfect choice.",
  "Hope so!",
  "Finished painting living room.",
  "Photos or it didn't happen.",
  "Sending…",
  "Looks class.",
  "Your advice paid off.",
  "Happy to help.",
  "Still playing that game?",
  "Addicted, rank 12.",
  "Beast mode.",
  "Jump back in.",
  "Might tonight.",
  "Duo queue?",
  "Hell yeah.",
  "Interview?",
  "Nailed it, start next month.",
  "Massive congrats!",
  "Drinks on me.",
  "Holding you to that.",
  "Old school group chat revived.",
  "Pure nostalgia.",
  "We were idiots 😂",
  "Best kind.",
  "New apartment?",
  "Settled, feels like home.",
  "About time!",
  "Housewarming?",
  "Next month.",
  "Count me in.",
  "Planted herbs balcony.",
  "Living the dream.",
  "Basil huge.",
  "Send pics when cook.",
  "Will do chef.",
  "Tried new sushi?",
  "Incredible.",
  "Have to go back.",
  "Next week?",
  "Booked.",
  "Trip to Kerala?",
  "Life changing.",
  "Jealous.",
  "You need to go.",
  "Adding to list.",
  "Thanks for rec.",
  "Anytime.",
  "Still doing yoga?",
  "Every morning.",
  "Discipline 100.",
  "You inspired me.",
  "Wholesome.",
  "Guitar coming along?",
  "Nailed that song.",
  "Proud man.",
  "Recording tonight.",
  "Send it.",
  "Will do.",
  "Just adopted a cat.",
  "Photos immediately.",
  "Sending… meet Mochi.",
  "I'm in love.",
  "She's perfect.",
  "Welcome to the club.",
  "Best decision ever.",
];

const getRandomMessage = () =>
  realisticMessages[Math.floor(Math.random() * realisticMessages.length)];

const getRandomAuthor = (participants) =>
  participants[Math.floor(Math.random() * participants.length)]._id;

const randomDateInMonth = (year, month0, daysInMonth) => {
  const day = Math.floor(Math.random() * daysInMonth) + 1;
  const hour = Math.floor(Math.random() * 24);
  const minute = Math.floor(Math.random() * 60);
  const second = Math.floor(Math.random() * 60);
  return new Date(year, month0, day, hour, minute, second);
};

await mongoose.connect(
  "mongodb://cappAdmin:077cbb0805b6ed873d62a6c44373b201@localhost:27017/chatdb?authSource=chatdb",
  {
    maxPoolSize: 15,
  }
);
console.log("Connected to MongoDB");

await Message.deleteMany({});
console.log("All messages deleted");

const specialUser = await User.findById(SPECIAL_USER_ID);
if (!specialUser) throw new Error("Special user not found");

let chats = await Chat.find({}).populate("participants");

for (const chat of chats) {
  const hasSpecial = chat.participants.some((p) =>
    p._id.equals(SPECIAL_USER_ID)
  );
  if (!hasSpecial) {
    chat.participants.push(SPECIAL_USER_ID);
    await chat.save();
    console.log(`Added special user to chat ${chat._id}`);
  }
  chat.messages = [];
  chat.messageCount = 0;
  await chat.save();
}

chats = await Chat.find({}).populate("participants");

const today = new Date(2025, 10, 17); // Nov 17 2025
const startDate = new Date(2024, 6, 1); // Jul 2024

const months = [];
let current = new Date(startDate);
while (current <= today) {
  const year = current.getFullYear();
  const month0 = current.getMonth();
  const isCurrent = year === today.getFullYear() && month0 === today.getMonth();
  const daysInMonth = isCurrent
    ? today.getDate()
    : new Date(year, month0 + 1, 0).getDate();
  months.push({ year, month0, daysInMonth });
  current.setMonth(current.getMonth() + 1);
}

console.log(`Generating messages for ${months.length} months`);

for (const chat of chats) {
  if (chat.participants.length < 2) continue;

  const messagesToCreate = [];

  for (const month of months) {
    const count =
      month.year < 2025 || (month.year === 2025 && month.month0 < 6) ? 2 : 4;
    for (let i = 0; i < count; i++) {
      messagesToCreate.push({
        text: getRandomMessage(),
        author: getRandomAuthor(chat.participants),
        timestamp: randomDateInMonth(
          month.year,
          month.month0,
          month.daysInMonth
        ),
      });
    }
  }

  messagesToCreate.sort((a, b) => a.timestamp - b.timestamp);

  for (const msgData of messagesToCreate) {
    const msg = await Message.create({
      author: msgData.author,
      text: msgData.text,
      timestamp: msgData.timestamp,
      viewedBy: chat.participants.map((p) => p._id),
      edited: false,
    });
    chat.messages.push(msg._id);
  }

  chat.messageCount = chat.messages.length;
  await chat.save();

  console.log(`Chat ${chat._id} → ${chat.messageCount} messages`);
}

console.log(
  "Done – all chats now have realistic English history with special user included everywhere."
);
process.exit(0);
