import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#2563eb', // Royal Blue
    },
    secondary: {
      main: '#0d9488', // Teal
    },
    background: {
      default: mode === 'light' ? '#f8fafc' : '#0f172a',
      paper: mode === 'light' ? '#ffffff' : '#1e293b',
    },
    text: {
      primary: mode === 'light' ? '#334155' : '#f8fafc',
      secondary: mode === 'light' ? '#64748b' : '#94a3b8',
    },
    success: {
      main: '#10b981', // Zümrüt Yeşili
    },
    warning: {
      main: '#f59e0b', // Amber
    },
    error: {
      main: '#f43f5e', // Rose
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid',
          borderColor: mode === 'light' ? '#e2e8f0' : '#334155',
          boxShadow: '0px 4px 20px rgba(37, 99, 235, 0.03)',
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(37, 99, 235, 0.03)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(1px)',
          },
        },
      },
    },
  },
});
