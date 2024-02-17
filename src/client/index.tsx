import { createRoot } from 'react-dom/client';
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import './style.css';
import '@fontsource/roboto';

import App from './components/App';

const container = document.getElementById('app') as Element;
const root = createRoot(container);
root.render(<RouterProvider router={App} />);
