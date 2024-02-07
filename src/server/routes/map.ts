import express from 'express';
import { Waypoint } from '../db/index';

const mapRouter = express.Router();

mapRouter.get('/waypoints', async (req, res) => {
  const waypoint = await Waypoint.create({ description: 'Test', long: -90.1, lat: 29.1 });
  console.log('waypoint created');
  res.status(200).send(waypoint);
});


export default mapRouter;
