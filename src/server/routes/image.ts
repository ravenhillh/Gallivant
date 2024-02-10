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

// GET images by foreign key/user Id
imageRouter.get('/user', (req, res) => {
  const { id } = req.user;
  // console.log('id ', id);

  Image.findAll({
    where: {
      id_user: id
    }
  })
  .then((data:string) => {
    // console.log('GET image data ', data);
    res.send(data).status(200);
  })
  .catch((err:string) => console.error('could not GET ', err));
});

export default imageRouter;