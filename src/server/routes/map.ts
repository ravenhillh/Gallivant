import express from 'express';
import { Waypoint } from '../db/index';

const mapRouter = express.Router();

mapRouter.get('/waypoints', async (req, res) => {
  const waypoint = await Waypoint.findAll();
  res.status(200).send(waypoint);
});


export default mapRouter;
