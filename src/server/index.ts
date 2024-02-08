import express from 'express';
import path from 'path';
import session from 'express-session';
import type { RequestHandler } from 'express';
import morgan from 'morgan';
import passport from 'passport';
import connectSessionSequelize from 'connect-session-sequelize';
import dotenv from 'dotenv';
dotenv.config();

import  { db } from './db';
import  authRouter  from './routes/auth';
import  mapRouter   from './routes/map';

const secret: string = process.env.EXPRESS_SECRET ?? 'default';
const SequelizeStore = connectSessionSequelize(session.Store);

const app = express();

// MIDDLEWARE
app.use(morgan('dev')); // logger
app.use(express.json()); // body parser
app.use(express.urlencoded({ extended: false })); // url-encoded body parser
app.use(express.static(path.resolve(__dirname, '../client/dist')));

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
// app.use(['/map', '/tours', '/icon', '/camera'], checkLoggedIn);

// ROUTES
app.use('/', authRouter);
app.use('/maps', mapRouter);


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(3000, () => {
  console.info('Gallivant server listening on port 3000. http://localhost:3000');
});
