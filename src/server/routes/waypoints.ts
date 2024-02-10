import express from 'express';
import { QueryTypes } from 'sequelize';
import { db, Tours_Waypoints, Waypoint } from '../db/index';

const waypointRouter = express.Router();

type Waypoint = {
  id: number;
  waypointName: string;
  description: string;
  long: number;
  lat: number;
};

waypointRouter.get('/db/tourWaypoints/:tourId', (req, res) => {
  const { tourId } = req.params;
  db.query(
    `select distinct * from waypoints
    join tours_waypoints
    on tours_waypoints.id_waypoint = waypoints.id
    and tours_waypoints.id_tour = ${tourId};`,
    { type: QueryTypes.SELECT }
  )
    .then((waypoints: Waypoint[]) => {
      // console.log(waypoints);
      res.status(200).send(waypoints);
    })
    .catch((err: string) => {
      console.error('Failed to findAll waypoints by tour id: ', err);
      res.sendStatus(500);
    });
});

waypointRouter.post('/db/waypoint/', async (req, res) => {
  const { waypoint, id_tour } = req.body;
  // const userId = req.user?.id;

  Waypoint.create(waypoint)
    .then(async (newWaypoint: Waypoint) => {
      await Tours_Waypoints.create({ id_tour, id_waypoint: newWaypoint.id });
      res.status(201).send(newWaypoint);
    })
    .catch((err: string) => {
      console.error('Failed to create waypoint: ', err);
      res.sendStatus(500);
    });
  //
});

waypointRouter.delete('/db/waypoint/:wp/:tour', async (req, res) => {
  const { wp, tour } = req.params;
  console.log('id_tour: ', tour, 'id_waypoint: ', wp);

  Tours_Waypoints.destroy({ where: { id_tour: tour, id_waypoint: wp } })
    .then(async () => {
      await Waypoint.destroy({ where: { id: wp } });
      res.sendStatus(200);
    })
    .catch((err: string) => {
      console.error('Failed to delete waypoint: ', err);
      res.sendStatus(500);
    });
});

export default waypointRouter;
