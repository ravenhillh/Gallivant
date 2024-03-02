import express from 'express';
import { User, Tour } from '../db/index';

const tourRouter = express.Router();

tourRouter.get('/db/tours', (req, res) => {
  Tour.findAll({ order: [['createdAt', 'DESC']] })
    .then((tours: object[]) => res.status(200).send(tours))
    .catch((err: string) => {
      console.error('Failed to findAll tours: ', err);
      res.status(500);
    });
});

tourRouter.get('/db/tour/:id', (req, res) => {
  const { id } = req.params;
  Tour.findAll({ where: { id } })
    .then((tour: object[]) => res.status(200).send(tour))
    .catch((err: string) => {
      console.error('Failed to find tour by id: ', err);
      res.status(500);
    });
});

tourRouter.get('/db/tourCreatedBy/:userId', (req, res) => {
  const { userId } = req.params;
  User.findAll({ where: { id: userId } })
    .then((user: object[]) => res.status(200).send(user))
    .catch((err: string) => {
      console.error('Failed to find user by id: ', err);
      res.status(500);
    });
});

// GET tours by category
tourRouter.get('/db/tours/:category', (req, res) => {
  const { category } = req.params;
  Tour.findAll({ where: { category } })
    .then((catTour: object[]) => {
      // console.log('Tour by cat ', catTour);
      res.send(catTour).status(200);
    })
    .catch((err: string) => {
      console.error('Could not GET Tours by category ', err);
      res.sendStatus(500);
    });
});

tourRouter.post('/db/tours', (req, res) => {
  const { tour } = req.body;
  Tour.create({ ...tour, id_createdByUser: req.user.id })
    .then((newTour: object) => {
      res.status(201).send(newTour);
    })
    .catch((err: string) => {
      console.error('Failed to create tour: ', err);
      res.sendStatus(500);
    });
});

tourRouter.put('/db/tourUpdate/:tourId', (req, res) => {
  const { tourId } = req.params;
  const { tour } = req.body;
  Tour.update({ ...tour }, { where: { id: tourId } })
    .then(() => res.sendStatus(200))
    .catch((err: string) => {
      console.error('Failed to Update tour: ', err);
      res.sendStatus(500);
    });
});

export default tourRouter;
