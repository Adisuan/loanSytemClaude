const express = require("express");
let router = express.Router();
const authController = require("../controllers/authController");

router.get("/login", authController.login);
router.post("/login", authController.loginSubmit);
router.get("/logout", authController.logout);

module.exports = router;
