import "./App.css";
import React, { useState, useEffect } from "react";
import Chessboard from "chessboardjsx";
import io from "socket.io-client";
import { Chess, Chess as ChessEngine } from "chess.js";
import DotDotDot from "./components/Dotdotdot";
import ChessClock from "./components/ChessClock";
import Alert from "./components/Alert";
import ButtonDropDown from "./components/ButtonDropDown";
import Options from "./components/Options";

const socket = io("http://localhost:4000");

const App = () => {
  const [chess, setChess] = useState(new ChessEngine());
  const [gameId, setGameId] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);
  const [playersReady, setPlayersReady] = useState(false);
  const [gameType, setGameType] = useState("online");

  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState([]);
  const [optionsFunction, setOptionsFunction] = useState(() => {});
  const [optionsParam, setOptionsParam] = useState("");
  const [optionsHeader, setOptionsHeader] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [showLoading, setShowLoading] = useState(false);
  const [timers, setTimers] = useState({ w: 300, b: 300 });
  const [showClock, setShowClock] = useState(false);

  useEffect(() => {
    let gameOverReason = "";
    if (chess.isGameOver()) {
      if (chess.isCheckmate()) {
        gameOverReason = "checkmate";
      } else if (chess.isStalemate()) {
        gameOverReason = "stalemate";
      } else if (chess.isDraw()) {
        gameOverReason = "draw";
      } else {
        gameOverReason = "unknown";
      }
      if (gameType === "online") {
        socket.emit("gameOver", {
          reason: gameOverReason,
          winner: chess.turn() === "b" ? "w" : "b",
        });
      } else {
        if (chess.turn() === "w") {
          blackWon(gameOverReason);
        } else {
          whiteWon(gameOverReason);
        }
      }
      return;
    }
    if (chess.isCheck()) {
      setAlertMessage("Check!");
      setShowAlert(true);
    }
    return () => {
      setShowAlert(false);
    };
  }, [chess]);

  useEffect(() => {
    if (playersReady) {
      if (timers["b"] <= 0) {
        if (gameType === "online") {
          socket.emit("gameOver", { reason: "time", winner: "w" });
        } else {
          if (chess.turn() === "b") {
            whiteWon("time");
          } else {
            blackWon("time");
          }
        }
      } else if (timers["w"] <= 0) {
        if (gameType === "online") {
          socket.emit("gameOver", { reason: "time", winner: "b" });
        } else {
          if (chess.turn() === "b") {
            whiteWon("time");
          } else {
            blackWon("time");
          }
        }
      }
    }
  }, [timers]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("gameJoined", handleGameJoined);
    socket.on("gameFound", handleGameFound);
    socket.on("beginGame", handleBeginGame);
    socket.on("updateChess", handleUpdateChess);
    socket.on("gameOver", handleGameOver);

    return () => {
      socket.off("connect");
      socket.off("updateChess", handleUpdateChess);
      socket.off("gameJoined", handleGameJoined);
      socket.off("gameFound", handleGameFound);
      socket.off("beginGame", handleBeginGame);
      socket.off("gameOver", handleGameOver);
    };
  }, [gameId, chess, timers, playersReady, socket]);

  const handleBeginGame = () => {
    setGameId("NEWID");
    setShowLoading(false);
    setPlayersReady(true);
    setShowClock(true);
  };

  const handleGameOver = (data) => {
    let { reason, winner } = data;
    if (reason === "resignation" && showAlert === false) {
      gameWon(reason);
      return;
    } else {
      if (playerColor === winner) {
        gameWon(reason);
      } else {
        gameLost(reason);
      }
    }
  };

  const whiteWon = (reason) => {
    setPlayersReady(false);
    setAlertMessage(`White Wins ${reason.toUpperCase()}`);
    setShowAlert(true);
    return;
  };

  const blackWon = (reason) => {
    setPlayersReady(false);
    setAlertMessage(`Black Wins ${reason.toUpperCase()}`);
    setShowAlert(true);
    return;
  };

  const gameWon = (reason) => {
    setPlayersReady(false);
    setAlertMessage(`Winner ${reason.toUpperCase()}`);
    setShowAlert(true);
    return;
  };

  const gameLost = (reason) => {
    setPlayersReady(false);
    setAlertMessage(`Loser ${reason.toUpperCase()}`);
    setShowAlert(true);
    return;
  };

  const moveLocal = (move) => {
    let temp = new Chess(chess.fen());
    temp.move(move);
    setPlayerColor(temp.turn());
    setChess(temp);
  };

  const moveAgainstEngine = (move) => {
    const temp = new ChessEngine(chess.fen());
    temp.move(move);
    setChess(temp);
    if (temp.isGameOver()) return;
    socket.emit("moveEngine", { fen: temp.fen(), depth: 3 });
  };

  const promotion = (param, option) => {
    setShowOptions(false);
    let promotion;
    if (option.includes("Bishop")) promotion = "b";
    if (option.includes("Knight")) promotion = "n";
    if (option.includes("Queen")) promotion = "q";
    if (option.includes("Rook")) promotion = "r";
    const move = { from: param.from, to: param.to, promotion: promotion };
    if (gameType === "local") {
      moveLocal(move);
      return;
    } else if (gameType === "online") {
      socket.emit("updateGame", { move: move, timers: timers });
      return;
    } else if (gameType === "engine") {
      moveAgainstEngine(move);
      return;
    }
    socket.emit("updateGame", { move: move, timers: timers });
  };

  const handleGameJoined = (data) => {
    const { id, color } = data;
    try {
      if (playerColor === "b") {
        socket.emit("beginGame");
      } else {
        setShowLoading(true);
      }
    } catch (error) {
      console.error("Error in handleGameJoined:", error);
    }
  };

  const handleGameFound = (data) => {
    const { id, color } = data;
    setPlayerColor(color);
    setGameId(id);
    socket.emit("joinGame");
  };

  const onDrop = ({ sourceSquare, targetSquare }) => {
    if (
      chess.turn() !== playerColor ||
      sourceSquare === targetSquare ||
      !playersReady
    ) {
      return;
    }
    let move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    };
    const temp = new ChessEngine(chess.fen());
    let verify;
    try {
      verify = temp.move(move);
    } catch (error) {
      console.log(error);
      return;
    }
    if (verify.promotion) {
      setOptionsFunction(() => promotion);
      setOptions(["Knight", "Queen", "Bishop", "Rook"]);
      setOptionsParam(move);
      setOptionsHeader("Promote");
      setShowOptions(true);
      return;
    }
    if (gameType === "local") {
      moveLocal(move);
      return;
    } else if (gameType === "online") {
      socket.emit("updateGame", { move: move, timers: timers });
      return;
    } else if (gameType === "engine") {
      moveAgainstEngine(move);
      return;
    }
  };

  const handleUpdateChess = async (data) => {
    const { move, timers } = data;
    let temp;
    try {
      temp = new ChessEngine(chess.fen());
      temp.move(move);
    } catch (error) {
      console.error(error);
    }
    if (timers) {
      setTimers(timers);
    }
    setChess(temp);
  };

  const decrementBlack = () => {
    setTimers((prevTimers) => ({
      ...prevTimers,
      b: prevTimers.b - 1,
    }));
  };

  const decrementWhite = () => {
    setTimers((prevTimers) => ({
      ...prevTimers,
      w: prevTimers.w - 1,
    }));
  };

  const createGame = (type, time) => {
    setChess(new ChessEngine());
    setShowOptions(false);
    setTimers({ w: time * 60, b: time * 60 });
    setGameType(type);
    if (type === "local") {
      setPlayersReady(true);
      setPlayerColor("w");
      handleBeginGame();
      return;
    } else if (type === "online") {
      socket.emit("findGame", { type: type, time: time });
    } else if (type === "engine") {
      const color = Math.random() < 0.5 ? "b" : "w";
      setPlayerColor(color);
      handleBeginGame();
      if (color === "b") {
        socket.emit("moveEngine", { fen: chess.fen(), depth: 3 });
      }
    } else {
      console.error(`type not found`);
    }
  };

  const initGame = (type) => {
    socket.disconnect();
    setTimeout(() => {
      socket.connect();
    }, 500);
    setAlertMessage("");
    setPlayersReady(false);
    setShowLoading(false);
    setChess(new ChessEngine());
    setGameId(null);
    setShowAlert(false);
    setShowClock(false);
    setOptionsFunction(() => createGame);
    setOptionsHeader("Set Timer");
    setOptions([1, 3, 5, 10]);
    setOptionsParam(type);
    setShowOptions(true);
  };

  return (
    <div className="container">
      <div className="headers-container">
        {showAlert && <Alert message={alertMessage} />}
        {showLoading && <DotDotDot />}
        {showClock && (
          <ChessClock
            alertMessage={alertMessage}
            freezeTimer={!playersReady}
            gameType={gameType}
            timers={timers}
            turn={chess.turn()}
            decrementBlack={decrementBlack}
            decrementWhite={decrementWhite}
            socket={socket}
          />
        )}
      </div>
      <div className="chessboard-container">
        <Chessboard
          position={gameId ? chess.fen() : "8 / 8 / 8 / 8 / 8 / 8 / 8 / 8"}
          onDrop={onDrop}
          className="chessboard"
          width={1000}
          orientation={playerColor === "b" ? "black" : "white"}
        />
        <div className="rotated-text">
          Chess<br></br>Classic
        </div>
      </div>
      <ButtonDropDown
        text="PLAY"
        dropdown={["local", "online", "engine"]}
        onClick={initGame}
      />
      {showOptions && (
        <Options
          onClick={optionsFunction}
          options={options}
          parameter={optionsParam}
          header={optionsHeader}
        />
      )}
    </div>
  );
};

export default App;
