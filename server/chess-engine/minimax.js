const { Chess } = require("chess.js");
const { evaluatePieceStrength } = require("./pieceEval");

const INFINITY = 1000000;

function indexToSquare(index) {
  const row = Math.floor(index / 8);
  const col = index % 8;
  return { row, col };
}

function evaluateBoard(board) {
  let value = 0;
  const fen = board.fen().split(" ")[0];
  let fenIndex = 0;
  for (let i = 0; fenIndex < fen.length; i++) {
    const piece = fen[fenIndex];
    fenIndex++;
    if (piece === "/") {
      i -= 1;
      continue;
    }
    if (piece >= "1" && piece <= "8") {
      i += parseInt(piece) - 1;
      continue;
    }
    const isWhite = piece.toUpperCase() === piece;
    const pieceType = piece.toLowerCase();

    const toSquare = indexToSquare(i);

    const pieceStrength = evaluatePieceStrength(pieceType, toSquare);

    value += pieceStrength * (isWhite ? 1 : -1);
  }

  return value;
}

function minimax(board, depth, alpha, beta, maximizingPlayer, botColor) {
  if (depth === 0 || board.isGameOver()) {
    if (board.isCheckmate()) {
      return maximizingPlayer ? INFINITY : -INFINITY;
    }
    return evaluateBoard(board) * (botColor === "w" ? 1 : -1);
  }
  const moves = board.moves({ verbose: true });
  if (maximizingPlayer) {
    let maxEval = -INFINITY;
    for (const move of moves) {
      board.move(move.san);
      const eval = minimax(board, depth - 1, alpha, beta, false, botColor);
      board.undo();
      maxEval = Math.max(maxEval, eval);
      alpha = Math.max(alpha, eval);
      if (beta <= alpha) {
        break;
      }
    }
    return maxEval;
  } else {
    let minEval = INFINITY;
    for (const move of moves) {
      board.move(move.san);
      const eval = minimax(board, depth - 1, alpha, beta, true, botColor);
      board.undo();
      minEval = Math.min(minEval, eval);
      beta = Math.min(beta, eval);
      if (beta <= alpha) {
        break;
      }
    }
    return minEval;
  }
}

function getBestMove(board, depth) {
  let bestMove = null;
  let maxEval = -INFINITY;
  let alpha = -INFINITY;
  let beta = INFINITY;
  let botColor = board.turn();
  const moves = board.moves({ verbose: true });
  for (const move of moves) {
    board.move(move.san);
    const eval = minimax(
      board,
      depth - 1,
      alpha,
      beta,
      botColor === "w" ? false : true,
      botColor
    );
    board.undo();
    if (eval > maxEval) {
      maxEval = eval;
      bestMove = move.san;
    }
    if (board.isCheckmate()) {
      bestMove = move.san;
      break;
    }
  }
  return bestMove;
}

module.exports = { getBestMove };
