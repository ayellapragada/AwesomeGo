import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import GameStart from '../game/GameStart';

class Lobby extends Component {
  constructor(props) {
    super(props);

    this.state = { one: 0, two: 0, game: false };
    this.updatePlayerConnection = this.updatePlayerConnection.bind(this);
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    const HOST = window.location.origin.replace(/^http/, 'ws');


    // Only need to change if doing anything with multiplayer.
    // if development
    // const noPort = HOST.match(/(.*)(:\d\d\d\d)/)[1];
    // this.socket = new WebSocket(`${noPort}:5000`); 

    // if live
    this.socket = new WebSocket(`${HOST}`); 

    this.socket.onopen = msg => {
      this.socket.send(JSON.stringify({ type: 'lobby', payload: id }));
    };

    this.socket.onmessage = (msg) => { 
      const obj = JSON.parse(msg.data);
      switch (obj.type){
        case 'open':
          sessionStorage.setItem('id', obj.payload);
          this.updatePlayerConnection(obj.payload);
          this.socket.send(JSON.stringify({
            type: 'connectToLobby',
            playerId: obj.payload, 
            lobby: id
          }));
          break;
        case 'addPlayer':
          this.updatePlayerConnection(obj.payload);
          break;
        default:
          break;
      }
    };
  }

  componentWillUnmount() {
    this.socket.close();
  }

  updatePlayerConnection(id) {
    const { one } = this.state;
    if (one) {
      this.setState({ two: id, game: true });
    } else {
      this.setState({ one: id });
    }
  }

  render() {
    const { one, two, game } = this.state;
    const { id } = this.props.match.params;

    return (
      <div>
        { !game ? (
          <div>
            Player One Loaded ? { one }
            <br />
            Player Two Loaded ? { two }
            <br />
            Your ID: {sessionStorage.getItem('id')}
          </div>
        ) : ( <GameStart 
          one={one} 
          two={two} 
          id={id} 
          socket={this.socket} 
        />)
        }
      </div>
    );
  }
}

export default withRouter(Lobby);
