const express = require("express");
let router = express.Router();
const loanController = require("../controllers/loanController");

router.get("/", loanController.index);
router.get("/apply", loanController.apply);
router.post("/create", loanController.loanCreatePost);
router.get("/:id", loanController.detail);
router.post("/list/dataTable", loanController.loanListDataTable);

module.exports = router;
