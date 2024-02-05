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
    },
    function (req, accessToken, refreshToken, profile, cb) {
      User.findOrCreate({
        where: {
          googleId: profile.id,
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
passport.deserializeUser(function (user: object, cb) {
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
  passport.authenticate('google', { failureRedirect: '/login' }),
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
