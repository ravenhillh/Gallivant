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

tourRouter.get('/db/tour/:id', (req, res) => {
  const { id } = req.params;
  Tour.findAll({ where: { id }})
    .then((tour: object[]) => res.status(200).send(tour))
    .catch((err: string) => {
      console.error('Failed to find tour by id: ', err);
      res.status(500);
    });
});

tourRouter.post('/db/tours', (req, res) => {
  const { tour } = req.body;
  Tour.create(tour)
    .then((newTour: object) => {
      res.status(201).send(newTour);
    })
    .catch((err: string) => {
      console.error('Failed to create tour: ', err);
      res.sendStatus(500);
    });
});

export default tourRouter;
