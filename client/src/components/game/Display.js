import React, { Component } from 'react';

import Chat from '../multi/Chat';
import Intersection, { TILE_SIZE } from './Intersection.js';

class Display extends Component {
  constructor(props) {
    super(props);

    this.state = {
      board: this.props.board,
      messages: [], 
      input: "",
    };

    this.socket = this.props.socket;
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handlePass = this.handlePass.bind(this);
    this.sendMove = this.sendMove.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.updateInput = this.updateInput.bind(this);
  }

  componentDidMount() {
    const that = this; // I hate myself for this.
    if (this.props.socket) {
      this.props.socket.onmessage = (msg) => {
        const obj = JSON.parse(msg.data);
        switch (obj.type) {

          case 'newMoveReceieved':
            this.state.board.makeMove(Number(obj.move[0]), Number(obj.move[1]));
            this.forceUpdate();
            break;
          case 'addMessage':
            that.setState({ messages: [...that.state.messages, obj.payload] });
            break;
          default: 
            break;
        }
      };
    }

  }

  sendMove(row, col) {
    const otherPlayer = 
      ( Number(sessionStorage.getItem('id')) ===
        Number(this.state.board.playerOne.name) ? this.state.board.playerTwo.name : this.state.board.playerOne.name); 

    let payload = { type: 'newMoveMade', move: [row, col], player: otherPlayer };
    this.props.socket.send(JSON.stringify(payload));
  }

  sendMessage() {
    const recipientId = 
      ( Number(sessionStorage.getItem('id')) ===
        Number(this.state.board.playerOne.name) ? this.state.board.playerTwo.name : this.state.board.playerOne.name); 


    if (this.state.board.playerTwo.name !== "HAL") {
      // if the other person is a player.
      this.socket.send(JSON.stringify({
        type: 'sendNewMessage',
        recipientId,
        playerId: sessionStorage.getItem('id'), 
        message: this.state.input,
      }));
    } 

    let message = { 
      playerId: sessionStorage.getItem('id'), 
      text: this.state.input 
    };

    this.setState({ messages: [...this.state.messages, message] });
    this.setState({ input: "" });
  }

  updateInput(e) {
    this.setState({ input: e.currentTarget.value  });
  }

  handleClick(row, col) {
    if ( Number(sessionStorage.getItem('id')) !==
      Number(this.state.board.currentPlayer.name)) {
      return false;
    }

    this.state.board.makeMove(row, col);
    if (this.props.socket) {
      this.sendMove(row, col);
    }
    this.forceUpdate();
  }

  handlePass() {
    this.state.board.pass();
    this.forceUpdate();
  }

  render() {
    const { playerOne, playerTwo, 
      currentPlayer, size, grid, history, over } = this.state.board;
    const yourId = sessionStorage.getItem('id');

    const intersectionList = [];
    const historyList = history.map((move, i) => (
      <div key={i}>{move[0]}-{move[1]} &nbsp;</div>
    ));

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
          <br />
          Game Status: { over ? "Over" : "In Progress" }
          <br />
          Turn: {Number(currentPlayer.name) 
              === Number(yourId) ? "Yours" : "Theirs"}
            </div>
            <button onClick={this.handlePass} type="text">Pass</button>
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
            <div style={{display: 'flex', flexWrap: 'wrapped'}}>
              { historyList }
            </div>
            <Chat 
              yourId={yourId}
              messages={this.state.messages} 
              input={this.state.input} 
              updateInput={this.updateInput}
              sendMessage={this.sendMessage}
            />
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
