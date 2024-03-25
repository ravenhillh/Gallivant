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
  forwardFab: React.JSX.Element;
  backwardFab: React.JSX.Element;
}

const Waypoint = (props: WaypointProps): JSX.Element => {
  const { waypoint, edit, forwardFab, backwardFab } = props;

  return (
    <Card
      className='current-waypoint-card'
      sx={{
        // backgroundColor: 'transparent',
        // boxShadow:
        //   '0px 4px 2px -2px rgba(0,0,0,0.4),0px 2px 2px 0px rgba(0,0,0,0.3),0px 2px 6px 0px rgba(0,0,0,0.2)',
        maxWidth: '650px',
      }}
    >
      <CardContent sx={{ padding: '5px' }}>
        <Grid
          container
          direction='column'
          justifyContent='center'
          alignItems='center'
        >
          <Grid item>
            <Typography variant='h4' fontSize='30px' fontWeight='bold'>
              {<RoomOutlinedIcon />} {waypoint.waypointName}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant='subtitle1'>{waypoint.description}</Typography>
          </Grid>
        </Grid>
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
          <Grid
            container
            direction='row'
            justifyContent='space-between'
            alignItems='flex-end'
          >
            <Grid item>{backwardFab}</Grid>
            <Grid item>{forwardFab}</Grid>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default Waypoint;
