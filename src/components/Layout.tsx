import React, { useState, useEffect, memo } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import HotelIcon from '@mui/icons-material/Hotel';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SpaIcon from '@mui/icons-material/Spa';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Slide from '@mui/material/Slide';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import PersonIcon from '@mui/icons-material/Person';
import Footer from '../components/Footer';

interface LayoutProps {
  children: React.ReactNode;
}

interface HideOnScrollProps {
  children: React.ReactElement;
}

function HideOnScroll(props: HideOnScrollProps) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

// Мемоізований компонент Footer для запобігання зайвих рендерів
const MemoizedFooter = memo(Footer);

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [servicesAnchorEl, setServicesAnchorEl] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState('/');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setActiveLink(location.pathname);
    
    // Перевіряємо, чи користувач авторизований
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleServicesMenu = (event: React.MouseEvent<HTMLElement>) => {
    setServicesAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleServicesClose = () => {
    setServicesAnchorEl(null);
  };

  const navLinks = [
    { title: 'Головна', path: '/' },
    { title: 'Готель', path: '/rooms' },
    { title: 'Ресторан', path: '/restaurant' },
    { title: 'Оренда авто', path: '/cars' },
    { title: 'Бронювання', path: '/booking' },
  ];

  const serviceLinks = [
    { title: 'Готель', path: '/rooms', icon: <HotelIcon fontSize="small" sx={{ mr: 1 }} /> },
    { title: 'Ресторан', path: '/restaurant', icon: <RestaurantIcon fontSize="small" sx={{ mr: 1 }} /> },
    { title: 'Оренда авто', path: '/cars', icon: <DirectionsCarIcon fontSize="small" sx={{ mr: 1 }} /> },
    { title: 'СПА', path: '/spa', icon: <SpaIcon fontSize="small" sx={{ mr: 1 }} /> },
  ];

  return (
    <div className="app-container">
      <HideOnScroll>
        <AppBar position="sticky" color="default" elevation={0} sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(8px)',
          transform: 'translateZ(0)' // Додаємо апаратне прискорення
        }}>
          <Toolbar sx={{ py: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <HotelIcon sx={{ color: 'primary.main', mr: 1, fontSize: 32 }} />
              <Typography 
                variant="h5" 
                component={RouterLink} 
                to="/" 
                sx={{ 
                  fontWeight: 700, 
                  color: 'text.primary', 
                  textDecoration: 'none',
                  letterSpacing: '-0.5px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <span style={{ color: theme.palette.primary.main }}>Maria</span>
                <span style={{ color: theme.palette.secondary.main }}>Lux</span>
              </Typography>
            </Box>
            
            {isMobile ? (
              <>
                <IconButton
                  edge="end"
                  color="primary"
                  aria-label="menu"
                  onClick={handleMenu}
                  sx={{ ml: 2 }}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  {navLinks.map((link) => (
                    <MenuItem 
                      key={link.path} 
                      onClick={handleClose} 
                      component={RouterLink} 
                      to={link.path}
                      selected={activeLink === link.path}
                    >
                      {link.title}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  component={RouterLink} 
                  to="/"
                  color={activeLink === '/' ? 'primary' : 'inherit'}
                  variant={activeLink === '/' ? 'contained' : 'text'}
                  className="btn-animated"
                  sx={{
                    fontWeight: 600,
                    px: 2,
                    borderRadius: '8px',
                    ...(activeLink === '/' ? {} : {
                      '&:hover': {
                        backgroundColor: 'rgba(46, 125, 50, 0.08)',
                      }
                    })
                  }}
                >
                  Головна
                </Button>

                <Button
                  color="inherit"
                  endIcon={<ExpandMoreIcon />}
                  onClick={handleServicesMenu}
                  className="btn-animated"
                  sx={{
                    fontWeight: 600,
                    px: 2,
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: 'rgba(46, 125, 50, 0.08)',
                    }
                  }}
                >
                  Послуги
                </Button>
                <Menu
                  id="services-menu"
                  anchorEl={servicesAnchorEl}
                  open={Boolean(servicesAnchorEl)}
                  onClose={handleServicesClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                  {serviceLinks.map((link) => (
                    <MenuItem 
                      key={link.path} 
                      onClick={handleServicesClose} 
                      component={RouterLink} 
                      to={link.path}
                      selected={activeLink === link.path}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        minWidth: '180px',
                        color: activeLink === link.path ? theme.palette.primary.main : 'inherit',
                      }}
                    >
                      {link.icon}
                      {link.title}
                    </MenuItem>
                  ))}
                </Menu>

                <Button 
                  component={RouterLink} 
                  to="/booking"
                  color={activeLink === '/booking' ? 'primary' : 'inherit'}
                  variant={activeLink === '/booking' ? 'contained' : 'text'}
                  className="btn-animated"
                  sx={{
                    fontWeight: 600,
                    px: 2,
                    borderRadius: '8px',
                    ...(activeLink === '/booking' ? {} : {
                      '&:hover': {
                        backgroundColor: 'rgba(46, 125, 50, 0.08)',
                      }
                    })
                  }}
                >
                  Бронювання
                </Button>

                {isLoggedIn ? (
                  <Button 
                    color="primary"
                    onClick={handleLogout}
                    startIcon={<PersonIcon />}
                    className="btn-animated"
                    sx={{
                      fontWeight: 600,
                      px: 2,
                      borderRadius: '8px',
                      ml: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(211, 47, 47, 0.08)',
                      }
                    }}
                  >
                    Вийти
                  </Button>
                ) : (
                  <Button 
                    component={RouterLink} 
                    to="/login"
                    color="primary"
                    variant="outlined"
                    startIcon={<PersonIcon />}
                    className="btn-animated"
                    sx={{
                      fontWeight: 600,
                      px: 2,
                      borderRadius: '8px',
                      ml: 1,
                      border: '1px solid',
                      borderColor: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: 'rgba(46, 125, 50, 0.08)',
                        borderColor: theme.palette.primary.dark,
                      }
                    }}
                  >
                    Увійти
                  </Button>
                )}
              </Box>
            )}
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      
      <main className="content">
        <Container maxWidth="lg">
          {children}
        </Container>
      </main>
      
      <MemoizedFooter />
    </div>
  );
};

export default Layout;
