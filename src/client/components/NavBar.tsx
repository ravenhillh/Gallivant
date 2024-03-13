import React, { useState } from 'react';
import {
  useLocation,
  useLoaderData,
  Outlet,
  useNavigate,
} from 'react-router-dom';
import axios from 'axios';

import {
  AppBar,
  Box,
  Button,
  CenterFocusWeakIcon,
  Container,
  Divider,
  Drawer,
  ExploreIcon,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  LogoutIcon,
  MapIcon,
  MenuIcon,
  RouteOutlinedIcon,
  // RouteSharpIcon,
  Toolbar,
  Typography,
} from '../utils/material';

export interface NavBarProps {
  children: React.ReactNode;
}

type User = {
  username: string;
  id: number;
  id_currentTour: number;
};

function NavBar() {
  const loadUser = useLoaderData() as User | null;
  const [user, setUser] = useState(loadUser);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [drawer, setDrawer] = useState<boolean>(false);

  const updateUserState = async () => {
    if (user) {
      const userData = await axios.get(`/user/${user.id}`);
      setUser(userData.data);
    }
    return null;
  };

  const toggleDrawer = () => {
    updateUserState();
    setDrawer((prevState) => !prevState);
  };

  return (
    <Container maxWidth={false} disableGutters className='nav-bar'>
      <AppBar position='sticky'>
        <Toolbar>
          <Typography
            onClick={() => navigate('/')}
            variant='h6'
            component='div'
            sx={{ cursor: 'pointer', flexGrow: 1 }}
          >
            {<RouteOutlinedIcon />} gallivant
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
          <Box sx={{ width: 222 }} role='presentation'>
            <List>
              <ListItem>
                <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                  {<RouteOutlinedIcon />} GALLIVANT
                </Typography>
              </ListItem>
              <Divider />

              <ListItem className='map-link'>
                <ListItemButton
                  selected={pathname === '/mapview'}
                  onClick={() => {
                    navigate('/mapview');
                    setDrawer(false);
                  }}
                >
                  <MapIcon />
                  Map
                </ListItemButton>
              </ListItem>
              <ListItem className='tours-link'>
                <ListItemButton
                  selected={pathname === '/tours/all'}
                  onClick={() => {
                    navigate('/tours/all');
                    setDrawer(false);
                  }}
                >
                  <ExploreIcon />
                  Tours
                </ListItemButton>
              </ListItem>
              {user && user?.id_currentTour ? (
                <ListItem className='current-tour-link'>
                  <ListItemButton
                    selected={pathname === '/currentTour'}
                    onClick={() => {
                      navigate('/currentTour');
                      setDrawer(false);
                    }}
                  >
                    <CenterFocusWeakIcon />
                    Current Tour
                  </ListItemButton>
                </ListItem>
              ) : (
                <></>
              )}

              <Divider />
              <ListItem className='logout-link'>
                <form action='/logout' method='post'>
                  <Button
                    startIcon={<LogoutIcon />}
                    variant='outlined'
                    type='submit'
                  >
                    Sign out
                  </Button>
                </form>
              </ListItem>
            </List>
          </Box>
        </Drawer>
      </AppBar>
      <div className='outlet'>
        <Outlet />
      </div>
    </Container>
  );
}

export default NavBar;
