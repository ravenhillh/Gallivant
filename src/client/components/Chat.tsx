import React, { useState, useEffect } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';
import axios from 'axios';
// import { io } from 'socket.io-client';
// const socket = io('http://localhost:3000');


type Message = {
  message: string;
  username: string
};
type User = {
  username: string
  id: number
}

const Chat = ({ socket }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { tour } = useParams();
  const user: User = useLoaderData();



  useEffect(() => {
    // take message received and set to state
    socket.connect();
    socket.on('message_response', (data) => setMessages([...messages, data]));

    return () => {
      socket.disconnect();
    };
  }, [socket, messages]);

  const sendMessage = () => {
    if (message !== '') {
      const name = user.username;
      const id = user.id;
      // Send message to socket server
      socket.emit('send_message', { message, name, id, tour });
      setMessage('');
      // save message to db
      axios.post('/chats/post', { chat: { message, tour } })
      .then(() => console.log('success'))
      .catch((err) => console.log(err));
    }
  };
  const getMessagesByTour = (id) => {
    axios(`/chats/tour/${id}`)
    .then(({ data }) => {
      console.log('successful tourchats retrieval', data);
      setMessages(data);
    })
    .catch(err => console.log(err));
  };

  const getAllMessages = () => {
    axios('/chats/get').then(({ data }) => {
      console.log(data);
      setMessages(data);
    })
    .catch((err) => console.log(err));
  };

  useEffect(() => {
    getMessagesByTour(tour);
  }, []);

  return (
    <div>
      {
        tour ? <div>Chat room: {tour}</div> : <div>Chat</div>
      }
      <div className="message-container">
        {
          messages.map((message: Message, i) => {
            return <div key={i}>{user.username}: {message.message}</div>;
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