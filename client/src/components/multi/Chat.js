import React, { Component } from 'react';

class Chat extends Component {
  constructor(props) {
    super(props);
  }

  updateScroll() {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  componentDidMount() {
    this.updateScroll();
  }

  componentDidUpdate(prevProps, prevState) {
    this.updateScroll();
  }

  componentWillReceiveProps(nextProps) {
    this.updateScroll();
  }

  render() {
    const { messages, input, updateInput, sendMessage, yourId } = this.props;

    const messageList = messages.map((msg, i) => {
      return(
        <li style={listItemStyle} key={i}>
          {msg.playerId === yourId ? "You" : "Them" }: {msg.text}
        </li>
      ); 
    });

    return (
      <div>
        <form onSubmit={sendMessage}>
          <input 
            style={inputStyle} 
            type="textarea" 
            onChange={updateInput} 
            value={input} 
            placeholder="Send a message!"
          />
        </form>
        <ul style={listStyle}>
          {messageList} 
        </ul>
        <div ref={(el) => { this.messagesEnd = el; }} />
      </div>
    );
  }
}

const inputStyle = {
  width: '100%',
  overflow: 'hidden',
};

const listItemStyle = {
  margin: '10px 5px',
};

const listStyle = {
  height: '500px',
  width: '500px',
  overflow: 'auto',
  overflowWrap: 'break-word',
  wordBreak: 'break-all',
};

export default Chat;

