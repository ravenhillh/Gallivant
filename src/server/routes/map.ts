import express from 'express';
import { Waypoint } from '../db/index';

const mapRouter = express.Router();

mapRouter.get('/waypoints', async (req, res) => {
  // const waypoint = await Waypoint.create({
  //    description: 'Holy Trinity Greek Orthodox Cathedral',
  //    prompt: 'What year was Holy Trinity founded?',
  //    answer: '1864',
  //    long: -90.0826,
  //    lat: 30.0201,
  //    });
  // res.status(200).send(waypoint);
    const waypoints = await Waypoint.findAll();
    res.status(200).send(waypoints);
});



export default mapRouter;
