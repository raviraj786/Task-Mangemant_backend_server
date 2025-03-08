const { uid } = require("uid");
const barypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { sendResponse, sendErrorResponse } = require("../utill/utills");
require("dotenv").config();

exports.createuser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const checkExists = await User.findOne({ email: email });
    if (checkExists) {
      return sendErrorResponse(res, 400, "User already exists");
    }
    const hasspassword = await barypt.hash(password, 10);
    const newuser = await User.create({
      userID: uid(16),
      username,
      email,
      password: hasspassword,
      status: "online",
    });
    await newuser.save();
    const token = jwt.sign({ userID: newuser.userID }, process.env.JWT_SECRET, {
      expiresIn: "24d",
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

exports.loginuser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      email,
      password,
    });
    if (!user) {
      return sendErrorResponse(res, 400, err.message || "User not found");
    }

    const passwordMatch = await barypt.compare(password, user.password);
    (user.status = "online"), user.save();
    if (!passwordMatch) {
      return sendErrorResponse(
        res,
        400,
        err.message || "Authentication failed"
      );
    }
    const token = jwt.sign({ userID: user.userID }, process.env.JWT_SECRET, {
      expiresIn: "24d",
    });
    return sendResponse(res, 200, "Login successfull", { user, token });
  } catch (error) {
    return sendErrorResponse(res, 500, err.message || "Internat Sever Error");
  }
};
