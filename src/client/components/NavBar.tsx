import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

// import Map from './Map';
// import Camera from './Camera';
// import Tours from './Tours';
// import Icon from './Icon';

export interface NavBarProps {
  children: React.ReactNode;
}

function NavBar() {
  const [drawer, setDrawer] = useState<boolean>(false);

  const toggleDrawer = () => {
    setDrawer((prevState) => !prevState);
  };

  return (
    <Container className='nav-bar'>
      <AppBar position='sticky'>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            gallivant
          </Typography>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2 }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
        <Drawer
          open={drawer}
          anchor='right'
          // onClick={toggleDrawer}
          onClose={toggleDrawer}
        >
          <Box sx={{ width: 250 }} role='presentation'>
            <List>
              <ListItem>
                <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                  GALLIVANT
                </Typography>
              </ListItem>
              <Divider />

              <ListItem className='map-link'>
                <ListItemButton>
                  <Link to='mapview'>MapView</Link>
                </ListItemButton>
              </ListItem>
              {/* <ListItem className='camera-link'>
                <ListItemButton>
                  <Link to='camera'>Camera</Link>
                </ListItemButton>
              </ListItem>
              <ListItem className='gallery-link'>
                <ListItemButton>
                  <Link to='gallery'>Gallery</Link>
                </ListItemButton>
              </ListItem> */}
              <ListItem className='tours-link'>
                <ListItemButton>
                  <Link to='tours'>Tours</Link>
                </ListItemButton>
              </ListItem>
              <ListItem className='icon-link'>
                <ListItemButton>
                  <Link to='icon'>Icon</Link>
                </ListItemButton>
              </ListItem>

              <Divider />
              <ListItem className='logout-link'>
                <form action='/logout' method='post'>
                  <Button variant='outlined' type='submit'>
                    Sign out
                  </Button>
                </form>
              </ListItem>
            </List>
          </Box>
        </Drawer>
      </AppBar>
      <Outlet />
    </Container>
  );
}

// <ul>
//   <li className='map-link'>
//     <Link to='mapview'>MapView</Link>
//   </li>
//   {/* <li className='camera-link'>
//     <Link to='camera'>Camera</Link>
//   </li>
//   <li className='gallery-link'>
//     <Link to='gallery'>Gallery</Link>
//   </li> */}
//   <li className='tours-link'>
//     <Link to='tours'>Tours</Link>
//   </li>
//   <li className='icon-link'>
//     <Link to='icon'>Icon</Link>
//   </li>
//   <li className='logout-link'>
//     <form action='/logout' method='post'>
//       <button type='submit'>Sign out</button>
//     </form>
//   </li>
// </ul>

export default NavBar;
