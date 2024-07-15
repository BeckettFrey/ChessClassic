// Example piece evaluation function
function evaluatePieceStrength(pieceType, position) {
  console.log("position: ", position);
  // Define evaluation criteria based on piece type and position
  switch (pieceType) {
    case "p": // Pawn
      return evaluatePawn(position);
    case "n": // Knight
      return evaluateKnight(position);
    case "b": // Bishop
      return evaluateBishop(position);
    case "r": // Rook
      return evaluateRook(position);
    case "q": // Queen
      return evaluateQueen(position);
    case "k": // King
      return evaluateKing(position);
    default:
      return 0; // Default value for unrecognized pieces
  }
}

// Example evaluation functions for each piece type
function evaluatePawn(position) {
  let rtn = 1;
  rtn = rtn + pawnTable[position.row][position.col];
  return rtn;
}

function evaluateKnight(position) {
  let rtn = 3;
  rtn = rtn + threeTable[position.row][position.col];
  return rtn;
}

function evaluateBishop(position) {
  let rtn = 3;
  rtn = rtn + threeTable[position.row][position.col];
  return rtn;
}

function evaluateRook(position) {
  let rtn = 5;
  rtn = rtn + rookTable[position.row][position.col];
  return rtn;
}

function evaluateQueen(position) {
  let rtn = 9;
  rtn = rtn + queenTable[position.row][position.col];
  return rtn;
}

function evaluateKing(position) {
  return 900;
}

module.exports = {
  evaluatePieceStrength,
};

const pawnTable = [
  [2, 2, 2, 2, 2, 2, 2, 2],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 1, 2, 2, 1, 0, 0],
  [0, 0, 1, 2, 2, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [2, 2, 2, 2, 2, 2, 2, 2],
];
const threeTable = [
  [-1, -1, -1, -1, -1, -1, -1, -1],
  [-1, 0, 0, 0, 0, 0, 0, -1],
  [-1, 0, 1, 1, 1, 1, 0, -1],
  [-1, 0, 1, 2, 2, 1, 0, -1],
  [-1, 0, 1, 2, 2, 1, 0, -1],
  [-1, 0, 1, 1, 1, 1, 0, -1],
  [-1, 0, 0, 0, 0, 0, 0, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1],
];

const rookTable = [
  [-1, 0, 0, 0, 0, 0, 0, -1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 1, 2, 2, 1, 0, 0],
  [0, 0, 1, 2, 2, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [-1, 0, 0, 0, 0, 0, 0, -1],
];

const queenTable = [
  [-1, -1, -1, -1, -1, -1, -1, -1],
  [-1, 0, 0, 0, 0, 0, 0, -1],
  [-1, 0, 2, 1, 1, 2, 0, -1],
  [-1, 0, 1, 2, 2, 1, 0, -1],
  [-1, 0, 1, 2, 2, 1, 0, -1],
  [-1, 0, 2, 1, 1, 2, 0, -1],
  [-1, 0, 0, 0, 0, 0, 0, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1],
];
