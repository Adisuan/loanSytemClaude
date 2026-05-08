const express = require("express");
let router = express.Router();
const paymentController = require("../controllers/paymentController");

router.get("/", paymentController.index);
router.get("/new", paymentController.newForm);
router.post("/new", paymentController.create);
router.get("/:receiptNo", paymentController.receipt);

module.exports = router;
