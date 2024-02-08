import express from 'express';
import { Image } from '../db/index';

const imageRouter = express.Router();

// POST image to db
imageRouter.post('/post', (req, res) => {
  const { image } = req.body;

  // .create
  // req.body[0].id
  // uploadData.key
});

export default imageRouter;