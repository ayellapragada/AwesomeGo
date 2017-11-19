import React from 'react';

const Chat = ({ messages, input, updateInput, sendMessage, yourId }) => {
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
        />
      </form>
      <ul style={listStyle}>{messageList}</ul>
    </div>
  );
};

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

