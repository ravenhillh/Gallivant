import express from 'express';
import { Review, db } from '../db/index';
import { QueryTypes } from 'sequelize';

const reviewRouter = express.Router();

type AvgRating = {
  'AVG(rating)': number;
};

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

// GET review avg by id_tour
reviewRouter.get('/rating/:id', (req, res) => {
  const { id } = req.params;

  db.query(`select AVG(rating) from reviews WHERE id_tour = ${id}`,
  { type: QueryTypes.SELECT }
  ).then((avgRating: AvgRating[]) => {
    res.send(avgRating[0]['AVG(rating)']).status(200);
  })
  .catch((err:string) => {
    console.error('Could Not GET average rating: ', err);
    res.sendStatus(500);
  });
});

// Update review
reviewRouter.put('/:id', (req, res) => {
  const { id } = req.params;
  // const { review } = req.body;

  Review.update(req.body, { where: { id }})
    .then(() => res.sendStatus(200))
    .catch((err:string) => {
      console.error('Could not update review ', err);
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
    .catch((err:string) => {
      console.error('Could not DELETE review: ', err);
      res.sendStatus(500);
    });
});

export default reviewRouter;