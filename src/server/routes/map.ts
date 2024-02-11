import express from 'express';
import { Waypoint, Tours_Waypoints } from '../db/index';

const mapRouter = express.Router();

mapRouter.get('/waypoints', (req, res) => {
  // const waypoint = await Waypoint.create({
  //    description: 'Holy Trinity Greek Orthodox Cathedral',
  //    prompt: 'What year was Holy Trinity founded?',
  //    answer: '1864',
  //    long: -90.0826,
  //    lat: 30.0201,
  //    });
  // res.status(200).send(waypoint);
   Waypoint.findAll()
   .then((data: object[]) => {
    res.status(200).send(data);
   })
   .catch((err: string) => console.log(err, 'get waypoints failed'));
});

mapRouter.get('/tours/:id', (req, res) => {
  //get waypoint id and use to query tours/waypoints join table
  //return all tours that include given waypoint
  const { id } = req.params;
  Tours_Waypoints.findAll({ where: { id_waypoint: id }})
  .then((tours: object[]) => {
    res.status(200).send(tours);
  })
  .catch((error: string) => {
    console.log(error);
  });
});


export default mapRouter;
