const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../utill/authMiddleware");

router.post("/singup", userController.createuser);
router.post("/login", userController.loginuser);
router.post("/forget-password", userController.forgetPassword);
router.post("/reset-password", userController.resetPassword);
router.get("/user/:userID", userController.getuser);
router.post("/tasks", authMiddleware, userController.addTasks);
router.get("/tasks", authMiddleware, userController.getAllTasks);

module.exports = router;
