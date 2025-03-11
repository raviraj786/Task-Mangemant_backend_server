const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    userID: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "{VALUE} is not a valid email",
        isAsync: false,
      },
    },
    password: { type: String, required: true },
    status: {
      type: String,
      default: "offline",
    },
    tasks: [
      {
        id: { type: String, default: null },
        title: { type: String, default: null },
        description: { type: String, default: null },
        createAt: { type: Date, default: Date.now },
      },
    ],
  },

  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
