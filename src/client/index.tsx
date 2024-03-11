import { createRoot } from 'react-dom/client';
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/';
import theme from './theme';
import './style.css';
import '@fontsource/roboto';

import App from './components/App';

const container = document.getElementById('app') as Element;
const root = createRoot(container);
root.render(
  <ThemeProvider theme={theme}>
    <RouterProvider router={App} />
  </ThemeProvider>
  );
