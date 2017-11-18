import React, { Component } from 'react';

import Intersection, { TILE_SIZE } from './Intersection.js';

class Display extends Component {

  constructor(props) {
    super(props);

    this.state = {
      board: this.props.board,
    };

    this.socket = this.props.socket;
    this.handleClick = this.handleClick.bind(this);
    this.sendMove = this.sendMove.bind(this);
  }

  componentDidMount() {
    this.props.socket.onmessage = (msg) => {
      const obj = JSON.parse(msg.data);
      switch (obj.type) {

        case 'newMoveReceieved':
          this.state.board.makeMove(Number(obj.move[0]), Number(obj.move[1]));
          this.forceUpdate();
      }
    };
  }

  sendMove(row, col) {
    const otherPlayer = 
      ( Number(sessionStorage.getItem('id')) ===
      Number(this.state.board.playerOne.name) ? this.state.board.playerTwo.name : this.state.board.playerOne.name); 

    let payload = { type: 'newMoveMade', move: [row, col], player: otherPlayer };
    this.props.socket.send(JSON.stringify(payload));
  }

  handleClick(row, col) {
      if ( Number(sessionStorage.getItem('id')) !==
        Number(this.state.board.currentPlayer.name)) {
        return false;
      }

    this.state.board.makeMove(row, col);
    this.sendMove(row, col);
    this.forceUpdate();
  }

  render() {
    const { playerOne, playerTwo, 
      currentPlayer, size, grid } = this.state.board;

    const intersectionList = [];

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        intersectionList.push(
          <Intersection 
            row={row} 
            col={col} 
            value={grid[row][col]} 
            key={`${row} ${col}`} 
            lastRow={row === (size - 1)}
            lastCol={col === (size -1)}
            handleClick={this.handleClick}
          />
        );
      }
    }

    return (
      <div>
        Display: {currentPlayer.name} 
        <br />
        Your ID: {sessionStorage.getItem('id')}
        <div>
          {playerOne.name} - {playerOne.captured}
          <br />
          {playerTwo.name} - {playerTwo.captured}
        </div>

        <div 
          style={gridContainerPositionStyle}>
          <div 
            style={{
              height: `${(TILE_SIZE + 2) * size}px`, 
              width: `${(TILE_SIZE - 1) * size}px`,
              ...gridContainerStyle,
            }}>
            { intersectionList }
          </div>
        </div>
      </div>
    );
  }
}
export default Display;


const gridContainerPositionStyle = {
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center',
};

const gridContainerStyle = {
  display: 'flex', 
  flexWrap: 'wrap',
  backgroundColor: 'burlywood',
  padding: '20px',
  paddingBottom: '30px',
  border: '1px solid black',
};