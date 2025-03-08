const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({
      message: "User not found",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ userID: decoded.userID, token: token });
    if (!user) return res.status(401).json({ message: "Invalid Token" });
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Inavalid or expired token" });
  }
};

module.exports = authMiddleware;
