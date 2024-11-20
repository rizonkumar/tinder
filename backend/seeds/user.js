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
  "Meme queen/king",
  "Weekend explorer",
  "Festivals fan",
  "Cricket lover",
  "Cultural enthusiast",
];

// Generate Random Bio
const generateBio = () => {
  const descriptors = bioDescriptors
    .sort(() => 0.5 - Math.random())
    .slice(0, 3); // Select 3 random descriptors
  return descriptors.join(" | ");
};

// Generate Random User
const generateRandomUser = (gender, index) => {
  const names = gender === "male" ? maleNames : femaleNames;
  const name = names[index];
  const age = Math.floor(Math.random() * (45 - 21 + 1) + 21); // Random age between 21 and 45
  return {
    name,
    email: `${name.toLowerCase()}${age}@example.com`, // Generate email from name and age
    password: bcrypt.hashSync("password123", 10), // Hardcoded password, hashed
    age,
    gender,
    genderPreference:
      genderPreferences[Math.floor(Math.random() * genderPreferences.length)], // Random gender preference
    bio: generateBio(),
    image: `/${gender}/${index + 1}.jpg`, // Profile image path
  };
};

// Seed Users into the Database
const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany({}); // Clear existing users

    // Generate users for male and female names
    const maleUsers = maleNames.map((_, i) => generateRandomUser("male", i));
    const femaleUsers = femaleNames.map((_, i) =>
      generateRandomUser("female", i)
    );

    // Combine all users
    const allUsers = [...maleUsers, ...femaleUsers];

    await User.insertMany(allUsers); // Insert users into database

    console.log("Database seeded successfully with Indian users and bios");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.disconnect();
  }
};

// Run the seeding function
seedUsers();
