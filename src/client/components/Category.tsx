// import React, { useEffect } from 'react';
// // import { Link } from 'react-router-dom';
// import axios from 'axios';
// // import { List, ListItem, ListItemIcon, ExploreIcon, ListItemText } from '../utils/material';

// const Category = ({category, setTours}) => {
//   // type Tour = {
//   //   id: number;
//   //   tourName: string;
//   //   description: string;
//   // };

//   // const { category } = useParams();
//   // const [tours, setTours] = useState<Tour[]>([]);

//   // GET tours by category name
//   const getToursByCat = () => {
//     axios.get(`/db/tours/${category}`)
//       .then(({data}) => {
//         setTours(data);
//       })
//       .catch(err => console.error('Failed to GET tours by category ', err));
//   };

//   useEffect(() => {
//     getToursByCat();
//   }, [category]);

//   return (
//     <div>
//       <h3>{ category?.toUpperCase() }</h3>
//       {/* <List>
//         {tours.map((tour, i) => {
//           return (
//             <ListItem key={i}>
//               <ListItemIcon>
//                 <ExploreIcon />
//               </ListItemIcon>
//               <ListItemText
//                 primary={<Link to={`/tour/${tour.id}`}>{tour.tourName}</Link>}
//                 secondary={tour.description}
//               />
//             </ListItem>
//           );
//         })}
//       </List> */}
//     </div>
//   );
// };

// export default Category;