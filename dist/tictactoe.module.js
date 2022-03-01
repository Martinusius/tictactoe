var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class TicTacToe {
  constructor() {
    __publicField(this, "_board", {});
    __publicField(this, "_bounds", { minX: 0, maxX: 2, minY: 0, maxY: 2 });
    __publicField(this, "_winCallbacks", []);
    __publicField(this, "_drawCallbacks", []);
    __publicField(this, "_goal", 3);
    __publicField(this, "_fillPosition", { x: 0, y: 0 });
    __publicField(this, "gameOver", false);
    __publicField(this, "boundingBox", null);
  }
  _checkWinner(x, y, player) {
    const checkLine = (dx, dy) => {
      let _x = x, _y = y, count = 0;
      while (this._board[`${_x},${_y}`] === player) {
        _x += dx;
        _y += dy;
        count++;
      }
      return count;
    };
    const horizontal = checkLine(1, 0) + checkLine(-1, 0) - 1;
    const vertical = checkLine(0, 1) + checkLine(0, -1) - 1;
    const diagonal = checkLine(1, 1) + checkLine(-1, -1) - 1;
    const antiDiagonal = checkLine(1, -1) + checkLine(-1, 1) - 1;
    if (Math.max(horizontal, vertical, diagonal, antiDiagonal) >= this._goal) {
      this.gameOver = true;
      this._winCallbacks.forEach((callback) => callback(player));
    }
  }
  _moveFill() {
    if (!this._bounds || this.gameOver)
      return;
    while (this._board[`${this._fillPosition.x},${this._fillPosition.y}`] !== void 0) {
      if (this._fillPosition.x === this._bounds.maxX) {
        if (this._fillPosition.y === this._bounds.maxY) {
          this.gameOver = true;
          this._drawCallbacks.forEach((callback) => callback());
          return;
        }
        this._fillPosition.x = this._bounds.minX;
        this._fillPosition.y++;
        continue;
      }
      this._fillPosition.x++;
    }
  }
  bounds(minX, minY, maxX, maxY) {
    if (minX > maxX || minY > maxY) {
      throw new Error(`Invalid bounds: ${minX}, ${minY}, ${maxX}, ${maxY}`);
    }
    this._bounds = { minX, minY, maxX, maxY };
    this._fillPosition = { x: minX, y: minY };
    return this;
  }
  size(width, height = width) {
    if (width <= 0 || height <= 0) {
      throw new Error(`Invalid size (not positive): ${width}, ${height}`);
    }
    this._bounds = { minX: 0, minY: 0, maxX: width - 1, maxY: height - 1 };
    this._fillPosition = { x: 0, y: 0 };
    return this;
  }
  infinite() {
    this._bounds = null;
    return this;
  }
  goal(goal) {
    if (goal <= 0) {
      throw new Error(`Invalid goal (not positive): ${goal}`);
    }
    this._goal = goal;
    return this;
  }
  move(x, y, player) {
    if (this.gameOver) {
      throw new Error("Cannot move: This game is already over");
    }
    if (typeof player !== "string") {
      throw new Error("The move has to be a string");
    }
    if (this._bounds && (this._bounds.minX > x || this._bounds.maxX < x || this._bounds.minY > y || this._bounds.maxY < y)) {
      throw new Error(`Move out of bounds: (Move: ${x}, ${y}, Bounds: ${this._bounds.minX}, ${this._bounds.minY}, ${this._bounds.maxX}, ${this._bounds.maxY})`);
    }
    if (this._board[`${x},${y}`] !== void 0) {
      throw new Error("Cannot move: Position is already taken");
    }
    if (!this.boundingBox) {
      this.boundingBox = { minX: x, minY: y, maxX: x, maxY: y };
    } else {
      this.boundingBox = {
        minX: Math.min(this.boundingBox.minX, x),
        minY: Math.min(this.boundingBox.minY, y),
        maxX: Math.max(this.boundingBox.maxX, x),
        maxY: Math.max(this.boundingBox.maxY, y)
      };
    }
    this._board[`${x},${y}`] = player;
    this._checkWinner(x, y, player);
    this._moveFill();
    return this;
  }
  on(event, callback) {
    if (event === "draw") {
      this._drawCallbacks.push(callback);
    } else if (event === "win") {
      this._winCallbacks.push(callback);
    }
  }
  get(x, y) {
    if (this._bounds && (this._bounds.minX > x || this._bounds.maxX < x || this._bounds.minY > y || this._bounds.maxY < y)) {
      throw new Error(`Get out of bounds: (Get: ${x}, ${y}, Bounds: ${this._bounds.minX}, ${this._bounds.minY}, ${this._bounds.maxX}, ${this._bounds.maxY})`);
    }
    return this._board[`${x},${y}`] || null;
  }
  reset() {
    this.gameOver = false;
    this._fillPosition = { x: 0, y: 0 };
    this._board = {};
  }
}
function tictactoe() {
  return new TicTacToe();
}
export { tictactoe as default };
