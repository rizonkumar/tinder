const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user-model.js");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const maleNames = [
  "Aarav",
  "Vivaan",
  "Aditya",
  "Ishaan",
  "Reyansh",
  "Ayaan",
  "Krishna",
  "Sai",
  "Arjun",
  "Vishal",
  "Karan",
  "Rohan",
  "Kabir",
  "Rohit",
  "Akash",
  "Dev",
  "Sameer",
  "Rahul",
  "Kunal",
  "Amit",
  "Siddharth",
  "Varun",
  "Kartik",
  "Yash",
  "Gaurav",
  "Nikhil",
  "Pranav",
  "Ranveer",
  "Ranbir",
  "Vikram",
];

const femaleNames = [
  "Aadhya",
  "Saanvi",
  "Ananya",
  "Isha",
  "Diya",
  "Priya",
  "Shruti",
  "Riya",
  "Meera",
  "Kavya",
  "Neha",
  "Pooja",
  "Tanvi",
  "Shreya",
  "Anjali",
  "Divya",
  "Aditi",
  "Sneha",
  "Kirti",
  "Ritu",
  "Simran",
  "Sakshi",
  "Kajal",
  "Nikita",
  "Payal",
  "Preeti",
  "Sonia",
  "Kiran",
  "Komal",
  "Shilpa",
];

const interestsPool = [
  "Gaming",
  "Travel",
  "Food",
  "Coding",
  "Music",
  "Fitness",
  "Reading",
  "Art",
  "Movies",
  "Yoga",
  "Photography",
  "Hiking",
  "Dancing",
  "Cricket",
];

const genderPreferences = ["male", "female", "both"];

const bioDescriptors = [
  "Tea enthusiast",
  "Spicy food lover",
  "Bollywood movie buff",
  "Yoga practitioner",
  "Music lover",
  "Travel enthusiast",
  "Bookworm",
  "Fitness fanatic",
  "Street food connoisseur",
  "Photography lover",
  "Animal lover",
  "Tech geek",
  "Cooking enthusiast",
  "Adventure seeker",
  "Nature lover",
  "Meme queen",
  "Meme king",
  "Weekend explorer",
  "Festivals fan",
  "Cricket lover",
  "Cultural enthusiast",
];

const generateBio = () => {
  const descriptors = [...bioDescriptors]
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
  return descriptors.join(" | ");
};

const getRandomInterests = () => {
  const count = Math.floor(Math.random() * 4) + 3;
  return [...interestsPool].sort(() => 0.5 - Math.random()).slice(0, count);
};

const generateRandomUser = (gender, index) => {
  const names = gender === "male" ? maleNames : femaleNames;
  const name = names[index];
  const age = Math.floor(Math.random() * 20 + 21);
  const imageNum = gender === "male" ? (index % 9) + 1 : (index % 12) + 1;
  return {
    name,
    email: `${name.toLowerCase()}${age}_${index + 1}@example.com`,
    password: bcrypt.hashSync("password123", 10),
    age,
    gender,
    genderPreference:
      genderPreferences[Math.floor(Math.random() * genderPreferences.length)],
    bio: generateBio(),
    interests: getRandomInterests(),
    image: `/${gender}/${imageNum}.jpg`,
  };
};

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany({});

    const maleUsers = maleNames.map((_, i) => generateRandomUser("male", i));
    const femaleUsers = femaleNames.map((_, i) =>
      generateRandomUser("female", i),
    );
    const allUsers = [...maleUsers, ...femaleUsers];

    await User.insertMany(allUsers);
    console.log("Database seeded successfully with 60 dummy profiles");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.disconnect();
  }
};

seedUsers();
