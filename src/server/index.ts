import express from 'express';
import path from 'path';
import session from 'express-session';
import type { RequestHandler } from 'express';
import morgan from 'morgan';
import passport from 'passport';
import connectSessionSequelize from 'connect-session-sequelize';
import http from 'http';
import cors from 'cors';
import { Server, Socket } from 'socket.io';

// import axios from 'axios';
// axios.defaults.baseURL = 'http://localhost:3000';
import dotenv from 'dotenv';
dotenv.config();

import  { db } from './db';
import  authRouter  from './routes/auth';
import  mapRouter   from './routes/map';
import imageRouter from './routes/image';
import reviewRouter from './routes/reviews';
import tourRouter from './routes/tours';
import userRouter from './routes/user';
import waypointRouter from './routes/waypoints';
import chatRouter from './routes/chat';

import {uploadPhoto, getFileStream } from './services/s3';


const secret: string = process.env.EXPRESS_SECRET ?? 'default';
const SequelizeStore = connectSessionSequelize(session.Store);

// Connect the express server to the http server and mount the socket
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? process.env.PRODUCTION_URL : 'http://localhost:3000'
  },
  path: '/socket/',
  transports: ['websocket', 'polling'],
});

// MIDDLEWARE
app.use(morgan('dev')); // logger
app.use(express.json({limit: '10mb'})); // body parser
app.use(express.urlencoded({ extended: false, limit: '10mb' })); // url-encoded body parser
app.use(express.static(path.resolve(__dirname, '../client/dist')));
app.use(cors());

// Authentication session middleware
app.use(session({
  secret,
  resave: false,
  saveUninitialized: false,
  store: new SequelizeStore({ db })
}));
app.use(passport.authenticate('session'));

const checkLoggedIn: RequestHandler = (req, res, next) => {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    next();
  }
  res.redirect('/login');
};

// protected routes in this array
// app.use(['/map', '/tours', '/icon', '/images'], checkLoggedIn);

// ROUTES
app.use('/', authRouter);
app.use('/maps', mapRouter);
app.use('/images', imageRouter);
app.use('/reviews', reviewRouter);
app.use('/', tourRouter);
app.use('/user', userRouter);
app.use('/', waypointRouter);
app.use('/', chatRouter);

// ** API ROUTES **

// GET image from s3
app.get('/api/images/:key', (req, res) => {
  const { key } = req.params;
  const readStream = getFileStream(key);

  readStream.pipe(res);
});

// POST image to S3
app.post('/api/images', (req, res) => {
  const { imageName, base64 } = req.body;

  uploadPhoto(imageName, base64)
    .then((data) => {
      res.send(data).status(201);
    })
    .catch((err) => {
      console.error('upload error ', err);
      res.sendStatus(500);
    });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

io.on('connection', (socket: Socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


// receive user messages and emit them back to all users
io.on('connection', (socket: Socket) => {
  //receive messages and send to other users
  socket.on('send_message', (data) => {
    const { tour } = data;
    socket.join(tour);
    io.to(tour).emit('message_response', data);
});
  socket.on('send_users', (data) => {
    //send back a message when user has entered room
    const { username, tour } = data;
    const bot = 'ChatBot';
    data.message = `${username} has entered the room`;
    data.username = bot;
    socket.join(tour);
    io.to(tour).emit('chat_users', data);
  });

});

server.listen(3000, () => {
  console.info('Gallivant server listening on port 3000. http://localhost:3000');
});
