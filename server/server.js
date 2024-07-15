const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const { Chess } = require("chess.js");
const Game = require("./models/ChessGame");
const { getBestMove } = require("./chess-engine/minimax");

const app = express();
const server = http.createServer(app);
require("dotenv").config();

const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    methods: ["GET", "POST"],
  },
});

mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

io.on("connection", (socket) => {
  let currentGameId = null;
  socket.on("beginGame", async () => {
    if (currentGameId) {
      io.to(currentGameId.toString()).emit("beginGame");
    } else {
      console.error("No current game ID for beginGame event");
    }
  });

  socket.on("moveEngine", async (data) => {
    const { fen, depth } = data;
    let sanMove;
    const temp = new Chess(fen);
    try {
      sanMove = await getBestMove(temp, depth);
    } catch (error) {
      console.error(error);
      return;
    }
    const moveInfo = temp.move(sanMove);
    const moveMent = { from: moveInfo.from, to: moveInfo.to, promotion: "q" };
    socket.emit("updateChess", { move: moveMent });
  });

  socket.on("findGame", async (data) => {
    if (currentGameId !== null) {
      io.to(currentGameId).emit("gameOver");
      socket.leave(currentGameId);
      currentGameId = null;
    }
    let color;
    const { type, time } = data;
    try {
      const existingGame = await Game.findOne({
        players: { $size: 1 },
        length: time,
      });
      if (existingGame) {
        color = "b";
        existingGame.players.push(socket.id);
        await existingGame.save();
        currentGameId = existingGame._id;
      } else {
        color = "w";
        const newGame = new Game({
          players: [socket.id],
          length: time,
        });
        await newGame.save();
        currentGameId = newGame._id;
      }
    } catch (error) {
      console.error("error creating game:", error);
      return;
    }
    socket.emit("gameFound", { id: currentGameId, color: color });
  });

  socket.on("gameOver", async (data) => {
    const { reason, winner } = data;
    if (currentGameId) {
      io.to(currentGameId.toString()).emit("gameOver", {
        winner: winner,
        reason: reason,
      });
      socket.leave(currentGameId);
      currentGameId = null;
    } else {
      console.error("No game in progress");
    }
  });

  socket.on("joinGame", async () => {
    try {
      socket.join(currentGameId.toString());
    } catch (error) {
      console.error(error);
    }
    socket.emit("gameJoined", { id: currentGameId });
  });

  socket.on("updateGame", async (data) => {
    const { move, timers } = data;
    const game = await Game.findById(currentGameId);
    if (game) {
      const chess = new Chess(game.fen);
      const moveResult = chess.move(move);
      game.moves.push(moveResult.san);
      game.fen = chess.fen();
      await game.save();
    } else {
      console.log("game model instance not found: ", currentGameId);
      return;
    }
    io.to(currentGameId.toString()).emit("updateChess", {
      move: move,
      timers: timers,
    });
  });

  socket.on("disconnect", async () => {
    socket.leave(currentGameId);
    if (currentGameId) {
      try {
        const game = await Game.findById(currentGameId);
        if (game.players.length === 1) {
          await Game.findByIdAndDelete(currentGameId);
        } else if (game.players.length === 2) {
          io.to(currentGameId.toString()).emit("gameOver", {
            winner: "set later",
            reason: "resignation",
          });
        }
      } catch (error) {
        console.error("Error during disconnection cleanup:", error);
      }
    }
  });
});

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
