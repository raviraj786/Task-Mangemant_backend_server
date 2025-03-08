const { uid } = require("uid");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const { sendResponse, sendErrorResponse } = require("../utill/utills");

const otpStore = {};

//create user apis
exports.createuser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const checkExists = await User.findOne({ email: email });
    if (checkExists) {
      return sendErrorResponse(res, 400, "User already exists");
    }
    const hasspassword = await bcrypt.hash(password, 10);
    const newuser = await User.create({
      userID: uid(16),
      username,
      email,
      password: hasspassword,
      status: "online",
    });
    await newuser.save();
    const token = jwt.sign({ userID: newuser.userID }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return sendResponse(
      res,
      200,
      "Your account has been successfully created",
      { newuser, token }
    );
  } catch (error) {
    return sendErrorResponse(res, 500, err.message || "Internal Server Error");
  }
};

//login apis
exports.loginuser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return sendErrorResponse(res, 400, "User not found");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return sendErrorResponse(
        res,
        400,
        err.message || "Authentication failed"
      );
    }
    user.status = "online";
    await user.save();
    const token = jwt.sign({ userID: user.userID }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return sendResponse(res, 200, "Login successfull", { user, token });
  } catch (error) {
    return sendErrorResponse(res, 500, err.message || "Internat Sever Error");
  }
};

//get user api
exports.getuser = async (req, res) => {
  const { userID } = req.params;
  try {
    if (!userID) {
      return sendErrorResponse(res, 404, "Invalid user ID");
    }
    const user = await User.findOne({ userID: userID });
    if (!user) {
      return sendErrorResponse(res, 400, "User not found");
    }
    return sendResponse(res, 200, "User fetched succssfully", user);
  } catch (error) {
    return sendErrorResponse(res, 400, error);
  }
};
//forget-password api
exports.forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return sendErrorResponse(res, 404, "User not found");
    }
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    otpStore[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        Pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "password Reset OTP",
      text: `Your OTP for Password reset is: ${otp},it is valid for 10 minuts `,
    };
    9;
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    return sendErrorResponse(res, 400, error);
  }
};

//reset password
exports.resetPassword = async (req, res) => {
  const { email, otp, newPssword } = req.body;
  try {
    if (
      !otpStore[email] ||
      otpStore[email].otp !== otp ||
      otpStore[email].expiresAt < Date.now()
    ) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return sendErrorResponse(res, 401, "User not found");
    }

    const hasspassword = await bcrypt.hash(newPssword, 10);
    user.password = hasspassword;
    await user.save();
    delete otpStore[email];
    return sendResponse(res, 200, "Password reset succesfull");
  } catch (error) {
    return sendErrorResponse(res, 400, error);
  }
};

// add Task

exports.addTasks = async (req, res) => {
  const { title, description } = req.body;
  const userID = req.user.userID;
  if (!title) {
    sendResponse(res, 401, "Title required");
  }
  try {
    const user = await User.findOne({ userID });
    if (!user) {
      return sendErrorResponse(res, 404, "User not found");
    }
    const newTask = {
      taskid: uid(11),
      title,
      description,
    };
    user.tasks.push(newTask);
    await user.save();
    return sendResponse(res, 201, "Task added successfully", user.tasks);
  } catch (error) {
    return sendErrorResponse(res, 400, error);
  }
};

exports.getAllTasks = async (req, res) => {
  const userID = req.user.userID;

  try {
    const tasks = await User.findOne({ userID });
    if (!tasks) {
      return sendErrorResponse(res, 401, "UserID not found");
    }
    console.log(tasks.tasks);

    return sendResponse(res, 200, "Task fetch Scussfull", {
      Tasks: tasks.tasks,
    });
  } catch (error) {
    return sendErrorResponse(res, 500, "error", error);
  }
};
