import React from 'react';

const Chat = ({ messages, input, updateInput, sendMessage }) => {
  const messageList = messages.map((msg, i) => {
    return <li key={i}>{msg.playerId}: {msg.text}</li>;
  });

  return (
    <div>
      <form onSubmit={sendMessage}>
        <input type="text" onChange={updateInput} value={input} />
      </form>
      <ul>{messageList}</ul>
    </div>
  );
};
export default Chat;

