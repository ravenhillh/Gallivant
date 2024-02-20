import express from 'express';
import { Review, Reviews_Tours } from '../db/index';

const reviewRouter = express.Router();

// POST to reviews
reviewRouter.post('/post', (req, res) => {
  const { feedback, rating } = req.body;
  const { id } = req.user;

  // console.log('fb: ', feedback);
  // console.log('rate: ', rating);
  // console.log('user id ', id);
  Review.create({ 
    id_user: id,
    feedback,
    rating
  })
    .then((data:any) => {
      // Reviews_Tours.create
      console.log(data);
      // data.dataValues.id 
    })
    .catch((err:any) => {
      console.error('Could not Post review: ', err);
      res.sendStatus(500);
    });
});

// select id_review from Reviews_Tours where id_tour = ' ' 
export default reviewRouter;