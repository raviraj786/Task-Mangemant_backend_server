const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MongoDB connection URI is missing!");
  process.exit(1);
}

const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URI || process.env.MONGO_URI);
    console.log(process.env.MONGO_URL);
  } catch (error) {
    console.error("Mongodb Connected Failed", error);
  }
};

module.exports = connectMongoDB;
