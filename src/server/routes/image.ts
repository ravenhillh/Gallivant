import express from 'express';
import { Image } from '../db/index';

const imageRouter = express.Router();

// POST image to db
imageRouter.post('/post', (req, res) => {
  const { image } = req.body;

  Image.create(image)
    .then(() => res.sendStatus(201))
    .catch((err:string) => {
      console.error(' db post error ', err);
      res.sendStatus(500);
    });

});

export default imageRouter;