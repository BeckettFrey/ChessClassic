import React, { useEffect, useState, useRef } from "react";

const ChessClock = ({
  alertMessage,
  freezeTimer,
  timers,
  turn,
  decrementWhite,
  decrementBlack,
}) => {
  const [zero, setZero] = useState(false);
  const timerIntervalRef = useRef(null);
  useEffect(() => {
    console.log("alert:", alertMessage);
    if (alertMessage.includes("TIME")) {
      setZero(true);
    }
    return () => {
      setZero(false);
    };
  }, [alertMessage]);

  useEffect(() => {
    if (timerIntervalRef.current !== null) {
      clearInterval(timerIntervalRef.current);
    }
    if (!freezeTimer && timers["b"] > 0 && timers["w"] > 0) {
      startTimer(turn);
    }
    return () => {
      clearInterval(timerIntervalRef.current);
    };
  }, [turn, freezeTimer]);

  useEffect(() => {
    if (timers["w"] <= 0 || timers["b"] <= 0) {
      clearInterval(timerIntervalRef.current);
    }
  }, [timers]);

  const startTimer = (turn) => {
    console.log("timer started: ", turn);
    timerIntervalRef.current = setInterval(() => {
      if (turn === "w") {
        decrementWhite();
      } else {
        decrementBlack();
      }
    }, 1000);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="chess-clock">
      <div className="timer white-timer">
        <span>{formatTime(zero && turn === "w" ? 0 : timers.w)}</span>
      </div>
      <div className="timer black-timer">
        <span>{formatTime(zero && turn === "b" ? 0 : timers.b)}</span>
      </div>
    </div>
  );
};

export default ChessClock;
