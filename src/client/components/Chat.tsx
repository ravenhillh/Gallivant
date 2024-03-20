import React, { useState, useEffect, useRef } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import {
  Alert,
  Button,
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

const Chat = ({ socket, chatUser, chatTour, chatName }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [newUser, setNewUser] = useState([]);
  const [open, setOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const { tour, name } = useParams();
  let  user: User  = useLoaderData();
  const lastMessageRef = useRef(null);

  useEffect(() => {
    if (tour === undefined) {
      setChatOpen(false);
      console.log(chatUser);
      user = chatUser;
    } else {
      setChatOpen(true);
    }
  }, []);

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
    const username = user.username || chatUser.username;
    const currTour = tour || chatTour;
    const chatListener = (data) => {
      setNewUser(data);
      setOpen(true);
    };

    socket.emit('send_users', {username, currTour});
    socket.on('chat_users', chatListener);
  }, []);

  useEffect(() => {
    const currTour = tour || chatTour;
    getMessagesByTour(currTour);
  }, []);

  useEffect(() => {
    // scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (message !== '') {
      const username = user.username || chatUser.username;
      const id = user.id || chatUser.id;
      const currTour = tour || chatTour;
      // Send message to socket server
      socket.emit('send_message', { message, username, id, currTour });
      setMessage('');
      // save message to db
      axios
        .post('/message/post', { chat: { message, currTour, username } })
        .then(() => console.log('successful post'))
        .catch((err) => console.log(err));
    }
  };

  const getMessagesByTour = (id) => {
    axios(`/message/tour/${id}`)
      .then(({ data }) => {
        setMessages(data);
        console.log(data);
      })
      .catch((err) => console.log(err));
  };

  const handleClick = () => {
    setChatOpen(!chatOpen);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleClose = () => {
  setOpen(false);
  };

  const style = {
  lineHeight: .25,
  marginTop: 0,
  marginBottom: 0
  };

  return (
    <div position='absolute'>
       {
      chatOpen ? (<div className='chat-container'>
      <Typography variant="h5" align="center" className='chat-header'>
            Room: {name || chatName}
            </Typography>
      <div >
          <List>
            {messages.map((message: Message, i) => {
              return (
                <ListItem key={i}>
                  <Grid container>
                    <Grid item xs={12}>
                      <ListItemText
                        align={message.username === user.username ? 'right' : 'left'}
                        primary={message.message}
                        sx={style}
                      ></ListItemText>
                    </Grid>
                    <Grid item xs={12} >
                      <ListItemText
                        align={message.username === user.username ? 'right' : 'left'}
                        secondary={message.username}
                        sx={style}
                      ></ListItemText>
                    </Grid>
                    <Grid item xs={12}  >
                      <ListItemText
                        align={message.username === user.username ? 'right' : 'left'}
                        secondary={dayjs(message.createdAt).fromNow()}
                        sx={style}
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
      {tour === undefined?
      (<Button
        className="chat-buttons"
        variant="outlined"
        onClick={() => handleClick()}
            >
          Chat
        </Button>) : ''}
    </div>
  ) : (<Button
    className="chat-buttons"
    variant="outlined"
    onClick={() => handleClick()}
        >
      Chat
    </Button>)
    }
    </div>
  );
};

export default Chat;
