import { createTheme } from '@mui/material/styles';
import { blue } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: blue[900],
      contrastText: '#e5e1e1'
    },
  },
  typography: {
    h2: {
      color: '#0F0C0C',
    },
    h3: {
      color: '#0F0C0C',
    },
    h4: {
      color: '#291F1F',
    },
    h5: {
      color: '#291F1F',
    },
    h6: {
      color: '#291F1F',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 768,
      lg: 1025,
      xl: 1536,
    },
  },
});

export default theme;