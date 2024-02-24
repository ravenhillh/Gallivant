import React, { useState, useEffect } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';
import axios from 'axios';
// import { io } from 'socket.io-client';
// const socket = io('http://localhost:3000');


type Message = {
  message: string;
  username: string
  name: string
};
type User = {
  username: string
  id: number
}

const Chat = ({ socket }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { tour, name } = useParams();
  const user: User = useLoaderData();


  useEffect(() => {
    socket.connect();

    socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // take message received and set to state
    const messageListener = (data) => {
      setMessages([...messages, data]);
    };

    socket.on('message_response', messageListener);
   
    
  }, [socket, messages]);

  const sendMessage = () => {
    if (message !== '') {
      const name = user.username;
      const id = user.id;
      // Send message to socket server
      socket.emit('send_message', { message, name, id, tour });
      setMessage('');
      // save message to db
      axios.post('/message/post', { chat: { message, tour, name } })
      .then(() => console.log('successful post'))
      .catch((err) => console.log(err));
    }
  };
  const getMessagesByTour = (id) => {
    axios(`/message/tour/${id}`)
    .then(({ data }) => {
      console.log(data)
      setMessages(data);
    })
    .catch(err => console.log(err));
  };

  const getAllMessages = () => {
    axios('/message/get').then(({ data }) => {
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
        name ? <div>Chat room: {name}</div> : <div>Chat</div>
      }
      <div className="message-container">
        {
          messages.map((message: Message, i) => {
            return <div key={i}>{message.name ? message.name: message.username}: {message.message}</div>;
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