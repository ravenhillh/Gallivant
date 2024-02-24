import express from 'express';
import { User } from '../db/index';

// ALL ROUTE PATHS PRECEDED BY '/user'
const userRouter = express.Router();

// GET user by id
userRouter.get('/:id', (req, res) => {
  const { id } = req.params;

  User.findByPk(id)
    .then((data: object) => {
      // console.log(data);
      res.send(data).status(200);
    })
    .catch((err: string) => {
      console.error('Could not GET user data ', err);
      res.sendStatus(500);
    });
});

userRouter.put('/startTour/:userId/:tourId', (req, res) => {
  const { userId, tourId } = req.params;
  User.update({ id_currentTour: tourId, currentPosition: 0 }, { where: { id: userId } })
    .then(() => res.sendStatus(200))
    .catch((err: string) => {
      console.error('Failed to Update id_currentTour of User: ', err);
      res.sendStatus(500);
    });
});

userRouter.put('/putPosition/:userId/:tourId/:position', (req, res) => {
  const { userId, tourId, position } = req.params;
  User.update({ id_currentTour: tourId, currentPosition: position }, { where: { id: userId } })
    .then(() => res.sendStatus(200))
    .catch((err: string) => {
      console.error('Failed to Update position of User: ', err);
      res.sendStatus(500);
    });
});

export default userRouter;