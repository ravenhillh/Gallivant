import express from 'express';
import { Tour } from '../db/index';

const tourRouter = express.Router();

tourRouter.get('/db/tours', (req, res) => {
  Tour.findAll()
    .then((tours: object[]) => res.status(200).send(tours))
    .catch((err: string) => {
      console.error('Failed to findAll tours: ', err);
      res.status(500);
    });
});

tourRouter.post('/db/tours', (req, res) => {
  const { tour } = req.body;
  Tour.create(tour)
    .then((data: object) => {
      console.log('Return data: ', data);
      res.status(201).send(data);
    })
    .catch((err: string) => {
      console.error('Failed to create tour: ', err);
      res.sendStatus(500);
    });
});

export default tourRouter;
