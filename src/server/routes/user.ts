import express from 'express';
import { User } from '../db/index';

const userRouter = express.Router();

// GET user by id
userRouter.get('/:id', (req, res) => {
  const { id } = req.params;

  User.findByPk(id)
    .then((data:any) => {
      // console.log(data);
      res.send(data).status(200);
    })
    .catch((err:any) => {
      console.error('Could not GET user data ', err);
      res.sendStatus(500);
    });
});

export default userRouter;