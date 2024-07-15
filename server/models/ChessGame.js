const mongoose = require("mongoose");

const chessGameSchema = new mongoose.Schema({
  players: {
    type: [String],
    required: true,
  },
  fen: {
    type: String,
    required: true,
    default: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  },
  moves: {
    type: [String],
    default: [],
  },
  length: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ChessGame = mongoose.model("ChessGame", chessGameSchema);

module.exports = ChessGame;
