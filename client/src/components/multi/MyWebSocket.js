import React, { Component } from 'react';

class MyWebSocket extends Component {
  componentDidMount() {
    const { id } = this.props;
    this.socket = new WebSocket(`ws://localhost:3001`);

    this.socket.onopen = msg => {
      this.socket.send(JSON.stringify({ type: 'lobby', payload: id }));
    };

    this.socket.onmessage = (msg) => { 
      const obj = JSON.parse(msg.data);
      switch (obj.type){
        case 'open':
          sessionStorage.setItem('id', obj.payload);
          this.props.onOpen(obj.payload);
          this.socket.send(JSON.stringify({
            type: 'connectToLobby',
            playerId: obj.payload, 
            lobby: id
          }));
          break;
        case 'addPlayer':
          this.props.onOpen(obj.payload);
          break;
        default:
          break;
      }
    };
  }

  componentWillUnmount() {
    this.socket.close();
  }

  render() {
    return (
      <div></div>
    );
  }
}
export default MyWebSocket;

