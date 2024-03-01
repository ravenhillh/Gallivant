import React from 'react';

import {
  Card,
  CardActions,
  CardContent,
  RoomOutlinedIcon,
  Typography,
  Grid,
} from '../../utils/material';
// CardMedia?

import Gallery from '../Gallery';
// import Voice from './Voice';

type Waypoint = {
  id: number;
  waypointName: string;
  description: string;
  long: number;
  lat: number;
};
interface WaypointProps {
  waypoint: Waypoint;
  // id_tour: string | undefined;
  edit: boolean;
}

const Waypoint = (props: WaypointProps): JSX.Element => {
  const { waypoint, edit } = props;

  return (
    <Card sx={{maxWidth: '70%'}}>
      <CardContent>
        <Typography variant='h4' fontWeight='bold' gutterBottom>
          {<RoomOutlinedIcon />} {waypoint.waypointName}
        </Typography>
        <Typography variant='subtitle1' gutterBottom>
          {waypoint.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Grid
          container
          direction='row'
          justifyContent='space-between'
          alignItems='flex-end'
        >
          <Grid item>
            <Gallery waypoint={waypoint} edit={edit} />
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default Waypoint;
