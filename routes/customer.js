const express = require("express");
let router = express.Router();
const customerController = require("../controllers/customerController");

router.get("/", customerController.index);
router.get("/:id", customerController.detail);

module.exports = router;
