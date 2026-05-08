const express = require("express");
let router = express.Router();
const indexController = require("../controllers/indexController");

router.get("/", indexController.dashboard);

module.exports = router;
