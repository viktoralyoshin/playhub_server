const Router = require("express");
const router = new Router();
const collectionController = require("../controllers/collectionController.js");

router.post("/create", collectionController.create);
router.post("/getgames", collectionController.getGames);
router.get("/getall", collectionController.getAll);

module.exports = router;
