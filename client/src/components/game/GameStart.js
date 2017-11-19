import React, { Component } from 'react';

import Display from './Display';

import Board from './Board';
import Player from './Player';

class GameStart extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      board: "",
      playerOneType: `Human`,
      playerTwoType: `${props.solo ? "Computer" : "Human"}`,
      size: 19,
      handicap: 0,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.handleSubmit();
  }

  handleSubmit(e) {
    const { 
      playerOneType,  
      playerTwoType, 
      size, 
      handicap 
    } = this.state;

    const { one, two } = this.props;

    const pOne = new Player(one, playerOneType);
    const pTwo = new Player(two, playerTwoType);

    const board = new Board({ 
      pOne, 
      pTwo, 
      size, 
      handicap  
    });

    this.setState({ board });
  }

  render() {
    const { board } = this.state;
    const { socket } = this.props;

    if (board) {
      return (
        <Display board={board} socket={socket} />
      );
    }

    return (
      <div>Loading...</div>
    );
  }
}

export default GameStart;
