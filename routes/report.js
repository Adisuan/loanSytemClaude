const express = require("express");
let router = express.Router();
const reportController = require("../controllers/reportController");

router.get("/", reportController.index);
router.get("/summary", reportController.summary);
router.get("/revenue", reportController.revenue);
router.get("/overdue", reportController.overdue);
router.get("/portfolio", reportController.portfolio);
router.get("/collateral", reportController.collateral);
router.get("/customer", reportController.customer);

module.exports = router;
