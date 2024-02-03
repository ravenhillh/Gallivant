import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../db/index';
import dotenv from 'dotenv';
dotenv.config();

// const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
const clientID: string = process.env.GOOGLE_CLIENT_ID ?? 'default';
const clientSecret: string = process.env.GOOGLE_CLIENT_SECRET ?? 'default';
const authRouter = express.Router();

passport.use(
  new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: 'http://localhost:3000/auth/google/callback',
      passReqToCallback: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    },
    function (
      req: any,
      accessToken: string,
      refreshToken: string,
      profile: any,
      cb: any
    ) {
      User.findOrCreate({
        where: {
          id: profile.id,
          email: profile.emails[0].value,
          username: profile.displayName,
        },
      })
        .then((user: object) => {
          cb(null, user);
        })
        .catch((err: string) => {
          console.log(err, 'strategy error');
          cb(err);
        });
    }
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.deserializeUser(function (user: any, cb) {
  cb(null, user);
});

//AUTH ROUTES
authRouter.get('/login', function (req, res) {
  res.render('login');
});

authRouter.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);

authRouter.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/home');
  }
);

authRouter.post('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

export default authRouter;
