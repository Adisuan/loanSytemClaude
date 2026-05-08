const express = require("express");
let router = express.Router();
const collateralController = require("../controllers/collateralController");

router.get("/", collateralController.index);
router.get("/new", collateralController.newForm);
router.post("/new", collateralController.create);
router.get("/:id", collateralController.detail);
router.get("/:id/edit", collateralController.editForm);
router.post("/:id/edit", collateralController.update);
router.post("/:id/delete", collateralController.destroy);

module.exports = router;
