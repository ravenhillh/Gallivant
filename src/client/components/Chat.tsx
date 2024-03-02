import React, { useState, useEffect, useRef } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import {
  Alert,
  Fab,
  List,
  ListItem,
  ListItemText,
  Grid,
  MeetingRoomIcon,
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
  const [newUser, setNewUser] = useState([]);
  const [open, setOpen] = useState(true);
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

  useEffect(() => {
    // receives usernames to set state
    const username = user.username;
    const chatListener = (data) => {
      setNewUser(data);
      setOpen(true);
    };

    socket.emit('send_users', {username, tour});
    socket.on('chat_users', chatListener);
  }, []);

  useEffect(() => {
    getMessagesByTour(tour);
  }, []);

  useEffect(() => {
    // scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
        // console.log(data);
        setMessages(data);
      })
      .catch((err) => console.log(err));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleClose = () => {
  setOpen(false);
  };

  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5" className="header-message" align="center">
            Room: {name}
          </Typography>
        </Grid>
      </Grid>
      <div className="message-container">
          <List>
            {messages.map((message: Message, i) => {
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
        <div ref={lastMessageRef}  />
        {open && <Alert
        variant="outlined"
        severity="info"
        onClose={handleClose}
        icon={<MeetingRoomIcon fontSize="inherit" />}
        >
          {newUser.message} - {newUser.username}
        </Alert>}
      </div>
      <Grid container style={{ padding: '20px' }}>
        <Grid item xs={11}>
          <TextField
            id="message-field"
            label="Type Something"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e)}
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
