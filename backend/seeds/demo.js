import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/user-model.js";
import { GENDERS, GENDER_PREFERENCES } from "../constants/genders.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const DEMO_PASSWORD = "password123";
const DEMO_DOMAIN = "demo.swipe.app";

const PROFILES = [
  { name: "Demo User", email: `demo@${DEMO_DOMAIN}`, age: 27, gender: GENDERS.MALE, genderPreference: GENDER_PREFERENCES.FEMALE, image: "/male/2.jpg", bio: "Weekend trekker, weekday coder. Looking for someone to split a plate of momos with.", interests: ["Travel", "Coding", "Food", "Music"], isGold: true },
  { name: "Ananya", email: `ananya@${DEMO_DOMAIN}`, age: 26, gender: GENDERS.FEMALE, genderPreference: GENDER_PREFERENCES.MALE, image: "/female/3.jpg", bio: "Art curator by day, home cook by night. Will judge your playlist.", interests: ["Art", "Cooking", "Music"] },
  { name: "Saanvi", email: `saanvi@${DEMO_DOMAIN}`, age: 24, gender: GENDERS.FEMALE, genderPreference: GENDER_PREFERENCES.BOTH, image: "/female/5.jpg", bio: "Marathon trainee. Yes, I will make you run with me.", interests: ["Fitness", "Travel", "Yoga"] },
  { name: "Meera", email: `meera@${DEMO_DOMAIN}`, age: 29, gender: GENDERS.FEMALE, genderPreference: GENDER_PREFERENCES.MALE, image: "/female/7.jpg", bio: "Photographer who talks to stray dogs. Coffee first, always.", interests: ["Photography", "Pets", "Reading"] },
  { name: "Riya", email: `riya@${DEMO_DOMAIN}`, age: 25, gender: GENDERS.FEMALE, genderPreference: GENDER_PREFERENCES.MALE, image: "/female/9.jpg", bio: "Product designer. Collects board games and opinions about fonts.", interests: ["Gaming", "Art", "Movies"] },
  { name: "Kavya", email: `kavya@${DEMO_DOMAIN}`, age: 28, gender: GENDERS.FEMALE, genderPreference: GENDER_PREFERENCES.MALE, image: "/female/11.jpg", bio: "Cricket on weekends, Bollywood on weeknights.", interests: ["Cricket", "Bollywood", "Food"] },
  { name: "Rohan", email: `rohan@${DEMO_DOMAIN}`, age: 30, gender: GENDERS.MALE, genderPreference: GENDER_PREFERENCES.FEMALE, image: "/male/4.jpg", bio: "Chef in training. Will cook, will not do dishes.", interests: ["Cooking", "Food", "Music"] },
];

const seedDemo = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const passwordHash = bcrypt.hashSync(DEMO_PASSWORD, 10);

  const users = {};
  for (const profile of PROFILES) {
    users[profile.email] = await User.findOneAndUpdate(
      { email: profile.email },
      { $set: { ...profile, password: passwordHash } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  const demo = users[`demo@${DEMO_DOMAIN}`];
  const ananya = users[`ananya@${DEMO_DOMAIN}`];
  const saanvi = users[`saanvi@${DEMO_DOMAIN}`];
  const meera = users[`meera@${DEMO_DOMAIN}`];
  const riya = users[`riya@${DEMO_DOMAIN}`];

  await User.updateOne(
    { _id: demo._id },
    { $set: { matches: [ananya._id, saanvi._id], likes: [ananya._id, saanvi._id, meera._id] } },
  );
  await User.updateOne({ _id: ananya._id }, { $set: { matches: [demo._id], likes: [demo._id] } });
  await User.updateOne({ _id: saanvi._id }, { $set: { matches: [demo._id], likes: [demo._id] } });
  await User.updateOne({ _id: riya._id }, { $set: { likes: [demo._id] } });

  console.log(`Demo data ready. Sign in with demo@${DEMO_DOMAIN} / ${DEMO_PASSWORD}`);
  await mongoose.disconnect();
};

seedDemo().catch((error) => {
  console.error("Demo seed failed:", error);
  process.exit(1);
});
