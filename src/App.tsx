import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { uk } from 'date-fns/locale';
import HomePage from './pages/HomePage';
import RoomsPage from './pages/RoomsPage';
import BookingPage from './pages/BookingPage';
import RestaurantPage from './pages/RestaurantPage';
import CarsPage from './pages/CarsPage';
import SpaPage from './pages/SpaPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPanelLayout from './pages/admin/AdminPanelLayout';
import AdminPanelDashboard from './pages/admin/AdminPanelDashboard';
import RoomsManagement from './pages/admin/RoomsManagement';
import BookingsManagement from './pages/admin/BookingsManagement';
import SpaManagement from './pages/admin/SpaManagement';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20',
      contrastText: '#fff',
    },
    secondary: {
      main: '#FFA000',
      light: '#FFB300',
      dark: '#FF8F00',
      contrastText: '#fff',
    },
    background: {
      default: '#F5F7FA',
      paper: '#fff',
    },
    text: {
      primary: '#2C3E50',
      secondary: '#34495E',
    },
  },
  typography: {
    fontFamily: [
      'Montserrat',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      letterSpacing: '0em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      letterSpacing: '0.00735em',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
      letterSpacing: '0em',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      letterSpacing: '0.0075em',
    },
    subtitle1: {
      fontSize: '1rem',
      letterSpacing: '0.00938em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      letterSpacing: '0.00714em',
    },
    body1: {
      fontSize: '1rem',
      letterSpacing: '0.00938em',
      lineHeight: 1.75,
    },
    body2: {
      fontSize: '0.875rem',
      letterSpacing: '0.01071em',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: '0.02857em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 24px',
          fontSize: '1rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={uk}>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/restaurant" element={<RestaurantPage />} />
            <Route path="/cars" element={<CarsPage />} />
            <Route path="/spa" element={<SpaPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            
            {/* Стара адміністративна панель (залишаємо для сумісності) */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="rooms" element={<RoomsManagement />} />
              <Route path="bookings" element={<BookingsManagement />} />
              <Route path="spa" element={<SpaManagement />} />
            </Route>
            
            {/* Нова адміністративна панель */}
            <Route path="/admin-panel" element={<AdminPanelLayout />}>
              <Route index element={<AdminPanelDashboard />} />
              <Route path="rooms" element={<RoomsManagement />} />
              <Route path="bookings" element={<BookingsManagement />} />
              <Route path="spa" element={<SpaManagement />} />
            </Route>
          </Routes>
        </Layout>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
