import express from 'express';
import { Review } from '../db/index';

const reviewRouter = express.Router();

// POST to reviews
reviewRouter.post('/post', (req, res) => {
  const { feedback, rating, id_tour } = req.body;
  const { id } = req.user;

  Review.create({
    id_user: id,
    id_tour,
    feedback,
    rating
  })
    .then(() => {
      res.sendStatus(201);
    })
    .catch((err:string) => {
      console.error('Could not Post review: ', err);
      res.sendStatus(500);
    });
});

// GET reviews by tour id
reviewRouter.get('/tour/:id', (req, res) => {
  const { id } = req.params;

  Review.findAll({ where: { id_tour: id }})
  .then((data:object) => {
    res.send(data).status(200);
  })
  .catch((err:string) => {
    console.error('could not GET ', err);
    res.sendStatus(500);
  });
});

// DELETE review by id
reviewRouter.delete('/:id', (req, res) => {
  const { id } = req.params;

  Review.destroy({ where: { id }})
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err:string) => console.error('Could not DELETE review: ', err));
});

export default reviewRouter;