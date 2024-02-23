import express from 'express';
import { Waypoint, Tours_Waypoints, Tour } from '../db/index';

const mapRouter = express.Router();
interface Tours {
  dataValues: {id_tour: number}
  id: number
}

mapRouter.get('/waypoints', (req, res) => {

   Waypoint.findAll()
   .then((data: object[]) => {
    res.status(200).send(data);
   })
   .catch((err: string) => console.log(err, 'get waypoints failed'));
});

mapRouter.get('/tours/:id', (req, res) => {
  //get waypoint id and use to query tours/waypoints join table
  //return tours that include given waypoint
  const { id } = req.params;
  Tours_Waypoints.findAll({ where: { id_waypoint: id }})
  .then((tours: Tours[]) => {
    const tourId = tours[0].dataValues.id_tour;
    Tour.findAll({ where: { id: tourId }})
    .then((matchedTours: object[]) => {
      res.status(200).send(matchedTours);
    })
    .catch((err: string) => console.log(err));
  })
  .catch((error: string) => {
    console.log(error);
  });
});


export default mapRouter;
