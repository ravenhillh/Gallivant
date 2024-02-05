import React from 'react';
import { Link } from 'react-router-dom';

// import Map from './Map';
// import Camera from './Camera';
// import Tours from './Tours';
// import Icon from './Icon';

export interface NavBarProps {
  children: React.ReactNode;
}

function NavBar() {
  return (
    <div className="nav-bar">
      <ul>
        <li className="map-link">
          <Link to="/map" reloadDocument={true}>Map</Link>
        </li>
        <li className="camera-link">
          <Link to="/camera">Camera</Link>
        </li>
        <li className="tours-link">
          <Link to="/tours">Tours</Link>
        </li>
        <li className="Icon-link">
          <Link to="/icon">Icon</Link>
        </li>
      </ul>
    </div>
  );
}

export default NavBar;
