// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  var Piece = require("./piece");
}
// DON'T TOUCH THIS CODE

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  let grid = []
  for (let i = 0; i < 8; i++) {grid.push(new Array(8))}
  grid[3][3] = new Piece("white");
  grid[3][4] = new Piece("black");
  grid[4][3] = new Piece("black");
  grid[4][4] = new Piece("white");

  return grid;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  let x = pos[0]
  let y = pos[1]
  if (x > 7 || y > 7 || x < 0 || y < 0 ) { 
    return false 
  } else {
    return true
  }
};

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  if (this.isValidPos(pos)) {
    let x = pos[0]
    let y = pos[1]
    return this.grid[x][y];
  } else {
    throw new Error("Not valid pos!")
  }
};


/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  let currPiece = this.getPiece(pos)
  if (currPiece) {
    if (currPiece.color === color) {
      return true
    } else {
      return false
  }
}  else { 
  return false 
}
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  let currPiece = this.getPiece(pos)
  if (currPiece) {
    return true
  } else {
    return false
  }
};


/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 */
Board.prototype._positionsToFlip = function(pos, color, dir, piecesToFlip){
  if (!piecesToFlip) {
    piecesToFlip = [];
  } else { 
    piecesToFlip.push(pos);
  }
  [x1, y1] = dir;
  [x2, y2] = pos;
  let newPos = [(x1 + x2), (y1 + y2)];
  if (!this.isValidPos(newPos)) { return []; }
  if (!this.isOccupied(newPos)) { return []; }
  if (this.isMine(newPos, color)) { 
    return piecesToFlip; 
  } else { return this._positionsToFlip(newPos, color, dir, piecesToFlip) }
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if (this.isOccupied(pos)) { 
    return false; 
  } 
  let res = []
  Board.DIRS.forEach(dir=>{
    res.push(...this._positionsToFlip(pos, color, dir))
  })
  if (res.length > 0) { 
    return true; 
  } else { return false; }
};

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  if (!this.validMove(pos, color)) {
    throw new Error("Invalid move!")
  } 
  let [x1, y1] = pos;
  this.grid[x1][y1] = new Piece(color)

  let moves = []
  for (let i = 0; i <Board.DIRS.length; i++) { 
    moves = moves.concat(this._positionsToFlip(pos, color, Board.DIRS[i])) 
  }

  moves.forEach(move=>{
    let piece = this.getPiece(move)
    piece.flip()
  })
};


/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  let res = []
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let currPoss = [i,j]
      if (this.validMove(currPoss, color)) {
        res.push(currPoss);
      console.log(res)
      }
    }
  }
  return res;
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  if (this.validMoves(color).length > 0) {
    return true;
  } else { return false;}
};



/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  if (!this.hasMove("black") && !this.hasMove("white")) {
    return true;
  } else { return false;}

};




/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
};


// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  module.exports = Board;
}
// DON'T TOUCH THIS CODE