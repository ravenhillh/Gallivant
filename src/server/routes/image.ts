import express from 'express';
import { db, Image, Images_Waypoints } from '../db/index';
import { QueryTypes } from 'sequelize';

const imageRouter = express.Router();

// POST image to db
imageRouter.post('/post', (req, res) => {
  const { key, joinId } = req.body;
  const { id } = req.user;

  Image.create({ id_user: id, largeImg: key })
    .then((data:any) => {
      Images_Waypoints.create({ id_waypoint: joinId, id_image: data.dataValues.id });
      res.sendStatus(201);
    })
    .catch((err:string) => {
      console.error(' db post error ', err);
      res.sendStatus(500);
    });

});

// GET images by foreign key/user Id
// imageRouter.get('/user', (req, res) => {
//   const { id } = req.user;
//   // console.log('id ', id);

//   Image.findAll({
//     where: {
//       id_user: id
//     }
//   })
//   .then((allImages:any) => {
//     // console.log('GET image data ', allImages);
//     res.send(allImages).status(200);
//   })
//   .catch((err:string) => console.error('could not GET ', err));
// });

// GET waypoint image by waypoint id, user id, and image id
imageRouter.get('/waypoint/:waypointId', (req, res) => {
  const { waypointId } = req.params;

  db.query(
    `SELECT * from Images WHERE id = (SELECT id_image FROM Images_Waypoints WHERE id_waypoint = ${waypointId})`,
    { type: QueryTypes.SELECT }
  )
  .then((imgWaypoint:any) => {
    res.send(imgWaypoint).status(200);
  })
  .catch((err:string) => {
    console.log('err ', err);
    res.sendStatus(500);
  });

});

// DELETE image from images and images_waypoints
imageRouter.delete('/:imageId', (req, res) => {
  const { imageId } = req.params;

  Image.destroy({ where: { id: imageId}})
    .then(() => res.sendStatus(200))
    .catch((err:string) => {
      console.error('Could not delete image from db ', err);
      res.sendStatus(500);
    });
});

export default imageRouter;