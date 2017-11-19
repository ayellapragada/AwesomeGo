const EMPTY = 0;
const WHITE = 1;
const BLACK = 2;

class Board {
  constructor(params) {
    const { size, handicap, pOne, pTwo, grid } = params;
    this.playerOne = pOne;
    this.playerTwo = pTwo;
    this.currentPlayer =  Number(pOne.name) > Number(pTwo.name) ?
      this.playerTwo : this.playerOne;
    this.currentColor = BLACK;

    this.size = size;
    this.handicap = handicap;
    this.grid = grid || this.makeGrid(size);
    this.history = [];

    this.lastMovePassed = false;
    this.inAtari = false;
    this.attemptedSuicde = false;
    this.makeMove = this.makeMove.bind(this);
    this.switchPlayers = this.switchPlayers.bind(this);
  }

  makeGrid(size) {
    const grid = [];
    for (let row = 0; row < size; row++) {
      grid[row] = [];
      for (let col = 0; col < size; col++) {
        grid[row][col] = EMPTY;
      }
    }
    return grid;
  }

  makeMove(row, col) {
    if (this.grid[row][col] !== EMPTY) {
      return false;
    }

    this.attemptedSuicide = this.inAtari = false;


    let color = this.grid[row][col] = this.currentColor;
    let captured = [];
    let neighbors = this.getAdjacentNeighbors(row, col);
    let atari = false;

    neighbors.forEach(pos => {
      const [ tempRow, tempCol ] = pos;
      let valueOfPos = this.grid[tempRow][tempCol];

      if (valueOfPos !== EMPTY && valueOfPos !== color) {
        let group = this.getGroup(tempRow, tempCol);
        if (group.liberties === 0) {
          captured.push(group);
        } else if (group.liberties === 1) {
          atari = true;
        }
      }
    });

    if (captured.length === 0 && this.getGroup(row, col).liberties === 0) {
      this.grid[row][col] = EMPTY;
      this.attemptedSuicde = true;
      return false;
    }

    this.history.push([row, col]);

    captured.forEach(group => {
      group.stones.forEach(stone => {
        const [ tempRow, tempCol ] = stone;
        this.grid[tempRow][tempCol] = EMPTY;
        this.currentPlayer.captured++;
      });
    });

    if (atari) {
      this.inAtari = true;
    }

    this.lastMovePassed = false;
    this.switchPlayers();
    return true;
  }

  getAdjacentNeighbors(row, col) {
    const neighbors = [];

    if (row > 0) { neighbors.push([row - 1, col]); }
    if (col < this.size - 1) { neighbors.push([row, col + 1]); }
    if (row < this.size - 1) { neighbors.push([row + 1, col]); }
    if (col > 0) { neighbors.push([row, col - 1]); }

    return neighbors;
  }

  getGroup(row, col) {

    let color = this.grid[row][col];

    if (color === EMPTY) {
      return null;
    }

    let visited = {};
    let visitedList = [];
    let queue = [[row, col]];
    let count = 0;


    while (queue.length > 0) {
      let stone = queue.pop();
      if (visited[stone]) { continue; }

      let [ tempRow, tempCol ] = stone;
      let neighbors = this.getAdjacentNeighbors(tempRow, tempCol);


      for (let i = 0; i < neighbors.length; i++) {
        let neighbor = neighbors[i];

        let [ neighborRow, neighborCol ] = neighbor;
        let valueOfNeighbor = this.grid[neighborRow][neighborCol];

        if (valueOfNeighbor === EMPTY) {
          count++;
        }

        if (valueOfNeighbor === color) {
          queue.push([neighborRow, neighborCol]);
        }
      }

      visited[stone] = true;
      visitedList.push(stone);
    }

    return { liberties: count, stones: visitedList };
  }

  endGame() {
    console.log('GAME OVERRR');
  }

  findGoodMove() {
    // const move = this.history[this.history.length -1];
    // return [move[0]+1, move[1]+1];

    const move = [this.findRandomMove(0, 18), this.findRandomMove(0, 18)];
    const [row, col] = move;
    while (this.grid[row][col] !== EMPTY) {
      move[0] += 1;
      move[1] += 1;
    }

    return move;
  }

  findRandomMove(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  pass() {
    if (this.lastMovePassed) {
      this.endGame();
    }
    this.lastMovePassed = true;
    this.switchPlayers();
  }

  switchPlayers() {
    this.currentColor = this.currentColor === BLACK ? WHITE : BLACK;
    this.currentPlayer = 
      this.currentPlayer === this.playerOne ? this.playerTwo : this.playerOne;

    if (this.currentPlayer.name === "HAL") {
      let move = this.findGoodMove();
      this.makeMove(move[0], move[1]);
    }
  }
}

export default Board;
