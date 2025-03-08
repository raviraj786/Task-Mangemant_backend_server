const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");





router.post("/singup", userController.createuser)
router.post("/login" , userController.loginuser)






module.exports = router;
