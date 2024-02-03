import express from 'express';
import path from 'path';
import session from 'express-session';
import * as logger from 'morgan';
import connectSessionSequelize from 'connect-session-sequelize';
import passport from 'passport';
import  { db } from './db';
import  authRouter  from './routes/auth';

import dotenv from 'dotenv';

dotenv.config();

const secret: string = process.env.EXPRESS_SECRET ?? 'default';
const SequelizeStore = connectSessionSequelize(session.Store);

const app = express();

// MIDDLEWARE
// app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.resolve(__dirname, '../client/dist')));

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
