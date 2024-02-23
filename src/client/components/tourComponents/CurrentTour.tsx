import React, { lazy, Suspense, useState, useEffect } from 'react';
import { useParams, useLoaderData, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Map = lazy(() => import('../Map'));
const Waypoint = lazy(() => import('./Waypoint'));

type Tour = {
  id: number;
  tourName: string;
  description: string;
  id_createdByUser: number;
};

const CurrentTour = (): JSX.Element => {
  // useParam hook to retrieve specific Tour
  const { tourId } = useParams();
  // loader returning user id from session verification
  const data = useLoaderData();

  const [tour, setTour] = useState<Tour>();
  const [waypoints, setWaypoints] = useState<object[]>([]);

  useEffect(() => {
    console.log(data);
    // getTour(user.id_currentTour);
    // getTourWPs(user.id_currentTour);
  }, []);

  // axios requests to db to get tour by id
  const getTour = (id: string | undefined) => {
    axios(`/db/tour/${id}`)
      .then(({ data }) => {
        setTour(data[0]);
      })
      .catch((err: string) => console.error('Could not GET tour by id: ', err));
  };
  // gets waypoints associated with the particular tourId
  const getTourWPs = (tourId: string | undefined) => {
    axios(`/db/tourWaypoints/${tourId}`)
      .then(({ data }) => {
        setWaypoints(data);
      })
      .catch((err: string) =>
        console.error('Could not GET waypoints by tour id: ', err)
      );
  };

  return (
    <>
      <p>Current Waypoint:</p>
    <Suspense fallback={<>Loading...</>}>
      <div>waypoint problem</div>
      {/* <Waypoint waypoint={waypoints[0]} id_tour={tourId} /> */}
    </Suspense>
    <Suspense fallback={<>Loading...</>}>
      {/* <Map waypoints={waypoints} /> */}
    </Suspense>
      <p>{tour?.tourName}: {tour?.description}</p>
    </>
  );
};

export default CurrentTour;
