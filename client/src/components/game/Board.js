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
    this.over = false;

    this.lastMovePassed = false;
    this.inAtari = false;
    this.attemptedSuicde = false;
    this.makeMove = this.makeMove.bind(this);
    this.pass = this.pass.bind(this);
    this.switchPlayers = this.switchPlayers.bind(this);
    this.makeComputerMove = this.makeComputerMove.bind(this);
    this.findGoodMove = this.findGoodMove.bind(this);
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
    this.over = true;
    const winner = this.scoreGame();
    console.log('winner');
  }

  scoreGame() {
    // For now just return player one always. Ego boost while i make computer.
    return this.playerOne;
  }

  findGoodMove() {
    // Plan:
    // Don't just save moves in history, also save points of interest/locations?
    // Points of interest could be initialized to the dots around it.
    // Then evaluate next 3 turns for each and determine which one to play on.
    // Evaluating could involve a board value, or how much territory is had.
    // From there it'd be minmax with alphapruning.
    // But first step would be saving PoI
    //
    // Or computer can pass....?

    // Alternative: Find all enemy groups, then attack in a way that a liberty
    // is removed. Prioritize groups with least liberties.

    // const otherColor = this.currentColor === BLACK ? WHITE : BLACK;

    const [row, col] = this.history[this.history.length-1];
    const moves = this.getAdjacentNeighbors(row, col);

    const potentialMoves = [];

    for (let i = 0; i < moves.length; i++) {
      let move = moves[i];
      let [tempRow, tempCol] = move;
      if (this.grid[tempRow][tempCol] === 0) { potentialMoves.push(move); }
    }

    return potentialMoves[Math.floor(Math.random()*potentialMoves.length)];
  }

  findAllGroups(color) {
  }

  findRandomMove(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  pass() {
    if (this.lastMovePassed) {
      this.endGame();
    }
    this.lastMovePassed = true;
    this.history.push(['turn', 'passed']);
    this.switchPlayers();
  }

  makeComputerMove() {
    if (this.lastMovePassed) {
      // Using this to test if game over works. It does.
      this.pass();
    } else {
      let move = this.findGoodMove();
      this.makeMove(move[0], move[1]);
    }
  }

  switchPlayers() {
    this.currentColor = this.currentColor === BLACK ? WHITE : BLACK;
    this.currentPlayer = 
      this.currentPlayer === this.playerOne ? this.playerTwo : this.playerOne;

    if (this.currentPlayer.name === "HAL") {
      this.makeComputerMove();
    }
  }
}

export default Board;
