import express from 'express';
import path from 'path';
import session from 'express-session';
import morgan from 'morgan';
import passport from 'passport';
import connectSessionSequelize from 'connect-session-sequelize';
import dotenv from 'dotenv';
dotenv.config();

import  { db } from './db';
import  authRouter  from './routes/auth';

const secret: string = process.env.EXPRESS_SECRET ?? 'default';
const SequelizeStore = connectSessionSequelize(session.Store);

const app = express();

// MIDDLEWARE
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, '../client/dist')));

// Authentication session middleware
app.use(session({
  secret,
  resave: false,
  saveUninitialized: false,
  store: new SequelizeStore({ db })
}));
app.use(passport.authenticate('session'));

// ROUTES
app.use('/', authRouter);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(3000, () => {
  console.info('Gallivant server listening on port 3000. http://localhost:3000');
});
