import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/user-model.js";
import Message from "../models/message-model.js";
import DatePlan from "../models/date-plan-model.js";
import { GENDERS, GENDER_PREFERENCES } from "../constants/genders.js";
import { MESSAGE_TYPES } from "../constants/message-types.js";
import { DATE_STATUSES } from "../constants/date-statuses.js";
import { CALL_STATUSES } from "../constants/call-statuses.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const DEMO_PASSWORD = "password123";
const DEMO_DOMAIN = "demo.swipe.app";
const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

const email = (handle) => `${handle}@${DEMO_DOMAIN}`;

const PROFILES = [
  { handle: "demo", name: "Demo User", age: 27, gender: GENDERS.MALE, genderPreference: GENDER_PREFERENCES.FEMALE, image: "/male/2.jpg", bio: "Weekend trekker, weekday coder. Looking for someone to split a plate of momos with.", interests: ["Travel", "Coding", "Food", "Music"], isGold: true },
  { handle: "ananya", name: "Ananya", age: 26, gender: GENDERS.FEMALE, genderPreference: GENDER_PREFERENCES.MALE, image: "/female/3.jpg", bio: "Art curator by day, home cook by night. Will judge your playlist.", interests: ["Art", "Cooking", "Music", "Travel"] },
  { handle: "saanvi", name: "Saanvi", age: 24, gender: GENDERS.FEMALE, genderPreference: GENDER_PREFERENCES.BOTH, image: "/female/5.jpg", bio: "Marathon trainee. Yes, I will make you run with me.", interests: ["Fitness", "Travel", "Yoga", "Food"] },
  { handle: "meera", name: "Meera", age: 29, gender: GENDERS.FEMALE, genderPreference: GENDER_PREFERENCES.MALE, image: "/female/7.jpg", bio: "Photographer who talks to stray dogs. Coffee first, always.", interests: ["Photography", "Pets", "Reading", "Coding"] },
  { handle: "riya", name: "Riya", age: 25, gender: GENDERS.FEMALE, genderPreference: GENDER_PREFERENCES.MALE, image: "/female/9.jpg", bio: "Product designer. Collects board games and opinions about fonts.", interests: ["Gaming", "Art", "Movies"] },
  { handle: "kavya", name: "Kavya", age: 28, gender: GENDERS.FEMALE, genderPreference: GENDER_PREFERENCES.MALE, image: "/female/11.jpg", bio: "Cricket on weekends, Bollywood on weeknights.", interests: ["Cricket", "Bollywood", "Food", "Music"] },
  { handle: "isha", name: "Isha", age: 26, gender: GENDERS.FEMALE, genderPreference: GENDER_PREFERENCES.MALE, image: "/female/1.jpg", bio: "Bookshop regular, terrible at plant care, great at road-trip playlists.", interests: ["Reading", "Travel", "Music"] },
  { handle: "diya", name: "Diya", age: 27, gender: GENDERS.FEMALE, genderPreference: GENDER_PREFERENCES.MALE, image: "/female/6.jpg", bio: "Climbing gym on Tuesdays, ramen on Fridays.", interests: ["Fitness", "Food", "Coding"] },
  { handle: "rohan", name: "Rohan", age: 30, gender: GENDERS.MALE, genderPreference: GENDER_PREFERENCES.FEMALE, image: "/male/4.jpg", bio: "Chef in training. Will cook, will not do dishes.", interests: ["Cooking", "Food", "Music"] },
];

const isoDate = (offsetDays) => {
  const target = new Date(Date.now() + offsetDays * DAY);
  return `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, "0")}-${String(target.getDate()).padStart(2, "0")}`;
};

const baseMessage = (sender, receiver, createdAt, overrides = {}) => ({
  _id: new mongoose.Types.ObjectId(),
  sender: sender._id,
  receiver: receiver._id,
  messageType: MESSAGE_TYPES.TEXT,
  mediaUrl: "",
  replyTo: null,
  isPinned: false,
  pinnedBy: null,
  isForwarded: false,
  read: true,
  readAt: new Date(createdAt.getTime() + 2 * MINUTE),
  expiresAt: null,
  isEdited: false,
  isDeleted: false,
  deletedFor: [],
  reactions: [],
  createdAt,
  updatedAt: createdAt,
  ...overrides,
});

const buildThread = (me, them, script) => {
  let cursor = Date.now() - script.startsDaysAgo * DAY;
  const byKey = {};
  return script.lines.map(({ key, from, gapMinutes = 2, content, unread, replyTo, ...rest }) => {
    cursor += gapMinutes * MINUTE;
    const createdAt = new Date(cursor);
    const [sender, receiver] = from === "me" ? [me, them] : [them, me];
    const message = baseMessage(sender, receiver, createdAt, {
      content,
      replyTo: replyTo ? byKey[replyTo] : null,
      ...(unread ? { read: false, readAt: null } : {}),
      ...rest,
    });
    if (key) byKey[key] = message._id;
    return message;
  });
};

const ANANYA_SCRIPT = {
  startsDaysAgo: 2,
  lines: [
    { from: "them", content: "Okay I have to ask. Is that Hampi in your second photo?" },
    { key: "hampi", from: "me", gapMinutes: 6, content: "It is! Did the boulders at sunrise. Absolutely worth the 4am alarm." },
    { from: "them", gapMinutes: 3, content: "I've been meaning to go for two years. Every long weekend I end up cooking instead 😅" },
    { from: "me", content: "Honestly that's not the worst way to spend a weekend. What do you cook?" },
    { from: "them", gapMinutes: 4, content: "Mostly Kerala food. My appam game is strong. Fish curry is a work in progress." },
    { from: "me", content: "Bold of you to admit the fish curry is a work in progress. I respect it." },
    { from: "them", gapMinutes: 1, content: "Two truths and a lie? I want to know if you're actually a trekker or just a guy with one good photo" },
    {
      from: "them",
      gapMinutes: 1,
      content: "Challenged you to two truths and a lie",
      messageType: MESSAGE_TYPES.GAME_TTAL,
      gameInfo: {
        statements: ["I've cooked for 40 people at a wedding", "I once won a Bollywood dance-off", "I can't swim"],
        lieIndex: 1,
        guessIndex: 1,
        status: "correct",
      },
    },
    { from: "me", gapMinutes: 5, content: "The dance-off. Nobody who curates art wins a dance-off." },
    { from: "them", content: "Rude. Correct, but rude." },
    { from: "me", gapMinutes: 600, content: "Morning! There's a new exhibition at the NGMA this weekend, have you seen it?" },
    { from: "them", gapMinutes: 12, content: "I helped hang half of it 🙈 I could give you the insider tour" },
    { key: "tour", from: "me", content: "That's the best offer I've had all week. Coffee after?" },
    {
      from: "me",
      gapMinutes: 1,
      content: "Proposed a date: Coffee",
      messageType: MESSAGE_TYPES.DATE_PROPOSAL,
      dateInfo: { date: isoDate(6), time: "11:30 AM", location: "Third Wave Coffee, Indiranagar", activity: "Coffee", status: DATE_STATUSES.ACCEPTED },
    },
    { from: "them", gapMinutes: 3, replyTo: "tour", content: "Deal. Saturday works, I'll meet you at the gate at 10." },
    { from: "me", gapMinutes: 1, content: "Perfect. I'll bring my best art opinions. All three of them." },
    { from: "them", gapMinutes: 2, content: "Can't wait to hear them 😄" },
  ],
};

const SAANVI_SCRIPT = {
  startsDaysAgo: 4,
  lines: [
    { from: "me", content: "Marathon trainee is a strong opener. Which one are you training for?" },
    { from: "them", gapMinutes: 20, content: "TCS 10K in November! Then the full one next year if my knees agree" },
    { from: "me", content: "Respect. My longest run was chasing a bus in Koramangala." },
    { from: "them", gapMinutes: 3, content: "That still counts as interval training" },
    { from: "me", gapMinutes: 1, content: "Voice call", messageType: MESSAGE_TYPES.AUDIO, callInfo: { status: CALL_STATUSES.COMPLETED, duration: 1260 } },
    { from: "them", gapMinutes: 30, content: "That was fun! Dinner plan is locked in the planner 🙌" },
    { from: "me", gapMinutes: 2, content: "Looking forward to it. You're picking dessert." },
    { from: "them", gapMinutes: 1500, content: "Also, I found a running route near Toit. We could walk it before dinner?", unread: true },
    { from: "them", gapMinutes: 1, content: "Only if you promise not to chase any buses", unread: true },
  ],
};

const MEERA_SCRIPT = {
  startsDaysAgo: 1,
  lines: [
    { from: "them", content: "Your dog in photo four. Name please. This is important." },
    { from: "me", gapMinutes: 15, content: "That's Pixel. He's a menace and I love him." },
    { from: "them", gapMinutes: 4, content: "Pixel 😭 I need to photograph him", unread: true },
  ],
};

const seedDemo = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const passwordHash = bcrypt.hashSync(DEMO_PASSWORD, 10);

  const users = {};
  for (const { handle, ...profile } of PROFILES) {
    users[handle] = await User.findOneAndUpdate(
      { email: email(handle) },
      {
        $set: { ...profile, email: email(handle), password: passwordHash, likes: [], matches: [], dislikes: [], superLikes: [], swipeHistory: [] },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  const { demo, ananya, saanvi, meera, riya, kavya, isha } = users;
  const demoUserIds = Object.values(users).map((user) => user._id);

  await User.updateOne({ _id: demo._id }, { $set: { matches: [ananya._id, saanvi._id, meera._id], likes: [ananya._id, saanvi._id, meera._id, isha._id] } });
  for (const match of [ananya, saanvi, meera]) {
    await User.updateOne({ _id: match._id }, { $set: { matches: [demo._id], likes: [demo._id] } });
  }
  for (const admirer of [riya, kavya]) {
    await User.updateOne({ _id: admirer._id }, { $set: { likes: [demo._id] } });
  }

  await Message.deleteMany({ sender: { $in: demoUserIds }, receiver: { $in: demoUserIds } });
  await Message.collection.insertMany([
    ...buildThread(demo, ananya, ANANYA_SCRIPT),
    ...buildThread(demo, saanvi, SAANVI_SCRIPT),
    ...buildThread(demo, meera, MEERA_SCRIPT),
  ]);

  await DatePlan.deleteMany({ userA: { $in: demoUserIds }, userB: { $in: demoUserIds } });
  const venueId = new mongoose.Types.ObjectId().toString();
  const slotId = new mongoose.Types.ObjectId().toString();
  const dinnerDate = isoDate(9);
  await DatePlan.create({
    userA: demo._id,
    userB: saanvi._id,
    categoryVotes: [
      { user: demo._id, category: "Dinner" },
      { user: saanvi._id, category: "Dinner" },
    ],
    venueProposals: [
      { id: venueId, proposedBy: saanvi._id, title: "Toit", location: "100 Feet Road, Indiranagar", votes: [demo._id, saanvi._id] },
      { id: new mongoose.Types.ObjectId().toString(), proposedBy: demo._id, title: "Glen's Bakehouse", location: "Lavelle Road", votes: [demo._id] },
    ],
    dateTimeProposals: [{ id: slotId, proposedBy: demo._id, date: dinnerDate, time: "19:30", votes: [demo._id, saanvi._id] }],
    finalVenue: { title: "Toit", location: "100 Feet Road, Indiranagar" },
    finalDateTime: { date: dinnerDate, time: "19:30" },
    status: "finalized",
  });

  await DatePlan.create({
    userA: demo._id,
    userB: ananya._id,
    categoryVotes: [
      { user: demo._id, category: "Drinks" },
      { user: ananya._id, category: "Outdoor" },
    ],
    venueProposals: [
      { id: new mongoose.Types.ObjectId().toString(), proposedBy: ananya._id, title: "Cubbon Park", location: "Kasturba Road", votes: [ananya._id] },
      { id: new mongoose.Types.ObjectId().toString(), proposedBy: demo._id, title: "Bob's Bar", location: "Indiranagar", votes: [demo._id] },
    ],
    dateTimeProposals: [{ id: new mongoose.Types.ObjectId().toString(), proposedBy: ananya._id, date: isoDate(13), time: "17:00", votes: [ananya._id, demo._id] }],
    status: "planning",
  });

  console.log(`Demo data ready. Sign in with ${email("demo")} / ${DEMO_PASSWORD}`);
  await mongoose.disconnect();
};

seedDemo().catch((error) => {
  console.error("Demo seed failed:", error);
  process.exit(1);
});
