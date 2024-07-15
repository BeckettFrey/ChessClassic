const express = require("express");
const router = express.Router();
const chessController = require("../controllers/chessController");

router.post("/create", chessController.createGame);

router.get("/:gameId", chessController.getGameById);

router.post("/:gameId/move", chessController.makeMove);

router.get("/:gameId/moves", chessController.getAllMoves);

module.exports = router;
