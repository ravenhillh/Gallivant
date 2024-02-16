import React from 'react';
import { Link, Outlet } from 'react-router-dom';

// import Map from './Map';
// import Camera from './Camera';
// import Tours from './Tours';
// import Icon from './Icon';

export interface NavBarProps {
  children: React.ReactNode;
}

function NavBar() {
  return (
    <div className='nav-bar'>
      <ul>
        <li className='map-link'>
          <Link to='mapview'>MapView</Link>
        </li>
        {/* <li className='camera-link'>
          <Link to='camera'>Camera</Link>
        </li>
        <li className='gallery-link'>
          <Link to='gallery'>Gallery</Link>
        </li> */}
        <li className='tours-link'>
          <Link to='tours'>Tours</Link>
        </li>
        <li className='icon-link'>
          <Link to='icon'>Icon</Link>
        </li>
        <li className='logout-link'>
          <form action='/logout' method='post'>
            <button type='submit'>Sign out</button>
          </form>
        </li>
        <Outlet />
      </ul>
    </div>
  );
}

export default NavBar;
