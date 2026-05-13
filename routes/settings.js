const express = require("express");
let router = express.Router();
const settingsController = require("../controllers/settingsController");

router.get("/", settingsController.indexRedirect);
router.get("/general",       settingsController.generalPage);
router.get("/loan-products", settingsController.loanProductsPage);
router.get("/fees",          settingsController.feesPage);
router.get("/channels",      settingsController.channelsPage);
router.get("/notifications", settingsController.notificationsPage);
router.get("/users",         settingsController.usersPage);
router.get("/security",      settingsController.securityPage);
router.get("/system",        settingsController.systemPage);

router.post("/:section", settingsController.save);

module.exports = router;
