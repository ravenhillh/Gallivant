import express, { RequestHandler, Request, Response } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../db/index';

// import { Express } from 'express-serve-static-core';
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((user: Array<any>) => {
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
passport.deserializeUser(function ([userInstance, created], cb) {
  cb(null, userInstance);
});


//AUTH ROUTES
// client side authentication check for protected component loaders
authRouter.get('/auth/client', (req: Request, res: Response) => {
  const verify: boolean = req.isAuthenticated();
  res.status(200).send(verify);
});

// Google authentication and redirect callback
authRouter.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);

authRouter.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

authRouter.post('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});

export default authRouter;
