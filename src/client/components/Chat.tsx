import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
const socket = io('http://localhost:3000');

type Message = {
  __createdtime__: number;
  message: string;
};

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('message_response', (data) => setMessages([...messages, data]));
    console.log(messages);
  }, [socket, messages]);

  const sendMessage = () => {
    if (message !== '') {
      const __createdtime__ = Date.now();
      // Send message to server
      socket.emit('send_message', { message, __createdtime__ });
      setMessage('');
    }
  };

  return (
    <div>
      Chats
      <div className="message-container">
        {
          messages.map((message: Message, i) => {
            return <div key={i}>{message.message}</div>;
          })
        }
      </div>
    <input
        placeholder='Message...'
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
      <button className='btn btn-primary' onClick={sendMessage}>
        Send Message
      </button>
    </div>
  );
};

export default Chat;