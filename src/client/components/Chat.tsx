import React, { useState, useEffect } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import {
  Fab,
  List,
  ListItem,
  ListItemText,
  Grid,
  TextField,
  SendIcon,
  Typography,
} from '../utils/material';

type Message = {
  message: string;
  username: string;
  name: string;
  createdAt: string;
};

type User = {
  username: string;
  id: number;
};

const Chat = ({ socket }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { tour, name } = useParams();
  const  user: User  = useLoaderData();
  const lastMessageRef = useRef(null);

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
      const username = user.username;
      const id = user.id;
      // Send message to socket server
      socket.emit('send_message', { message, username, id, tour });
      setMessage('');
      // save message to db
      axios
        .post('/message/post', { chat: { message, tour, username } })
        .then(() => console.log('successful post'))
        .catch((err) => console.log(err));
    }
  };

  const getMessagesByTour = (id) => {
    axios(`/message/tour/${id}`)
      .then(({ data }) => {
        setMessages(data);
      })
      .catch((err) => console.log(err));
  };

  // const getAllMessages = () => {
  //   axios('/message/get')
  //     .then(({ data }) => {
  //       setMessages(data);
  //     })
  //     .catch((err) => console.log(err));
  // };

  useEffect(() => {
    getMessagesByTour(tour);
  }, []);
  useEffect(() => {
    // scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h4" className="header-message">
            {name ? <div>Chat room: {name}</div> : <div>Chat</div>}
          </Typography>
        </Grid>
      </Grid>
      <div className="message-container">
        <Grid item xs={9}>
          <List>
            {messages.map((message: Message, i) => {
              // return <div key={i}>{message.username}: {message.message}</div>;
              return (
                <ListItem key={i}>
                  <Grid container>
                    <Grid item xs={12}>
                      <ListItemText
                        align={message.username === user.username ? 'right' : 'left'}
                        primary={message.message}
                      ></ListItemText>
                    </Grid>
                    <Grid item xs={12}>
                      <ListItemText
                        align={message.username === user.username ? 'right' : 'left'}
                        secondary={message.username}
                      ></ListItemText>
                    </Grid>
                    <Grid item xs={12}>
                      <ListItemText
                        align={message.username === user.username ? 'right' : 'left'}
                        secondary={dayjs(message.createdAt).fromNow()}
                      ></ListItemText>
                    </Grid>
                  </Grid>
                </ListItem>
              );
            })}
          </List>
        </Grid>
      <div ref={lastMessageRef} />
      <Grid container style={{ padding: '20px' }}>
        <Grid item xs={11}>
          <TextField
            id="message-field"
            label="Type Something"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Grid>
        <Grid item xs={1} align="right">
          <Fab color="primary" aria-label="add" onClick={sendMessage}>
            <SendIcon />
          </Fab>
        </Grid>
      </Grid>
    </div>
  );
};

export default Chat;
