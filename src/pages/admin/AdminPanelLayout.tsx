import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Container,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Hotel as HotelIcon,
  EventNote as BookingIcon,
  Spa as SpaIcon,
  People as UsersIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const AdminPanelLayout: React.FC = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Перевірка авторизації адміністратора
    const checkAdminAuth = () => {
      console.log('AdminPanelLayout: Checking admin authentication...');
      setLoading(true);
      
      // Отримуємо дані адміністратора з localStorage
      const adminToken = localStorage.getItem('adminToken');
      const adminUserStr = localStorage.getItem('adminUser');
      
      console.log('AdminPanelLayout: Admin token from localStorage:', adminToken ? 'exists' : 'not found');
      console.log('AdminPanelLayout: Admin user data from localStorage:', adminUserStr);
      
      if (!adminToken || !adminUserStr) {
        console.log('AdminPanelLayout: No admin token or user data, redirecting to admin login...');
        navigate('/admin-login');
        return;
      }

      try {
        const adminData = JSON.parse(adminUserStr);
        console.log('AdminPanelLayout: Parsed admin data:', adminData);
        
        if (!adminData || adminData.role !== 'admin') {
          console.log('AdminPanelLayout: Not admin, redirecting to admin login...');
          navigate('/admin-login');
          return;
        }

        console.log('AdminPanelLayout: User is admin, setting user data...');
        setUser(adminData);
      } catch (error) {
        console.error('AdminPanelLayout: Error parsing admin data:', error);
        navigate('/admin-login');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, [navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    console.log('AdminPanelLayout: Logging out admin...');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    console.log('AdminPanelLayout: Admin token and user data removed from localStorage');
    navigate('/admin-login');
  };

  const handleSettings = () => {
    // Перехід до налаштувань
    navigate('/admin-panel/settings');
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Maria Lux Admin
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/admin-panel">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Панель управління" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/admin-panel/rooms">
            <ListItemIcon>
              <HotelIcon />
            </ListItemIcon>
            <ListItemText primary="Номери" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/admin-panel/bookings">
            <ListItemIcon>
              <BookingIcon />
            </ListItemIcon>
            <ListItemText primary="Бронювання" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/admin-panel/spa">
            <ListItemIcon>
              <SpaIcon />
            </ListItemIcon>
            <ListItemText primary="СПА-послуги" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/admin-panel/users">
            <ListItemIcon>
              <UsersIcon />
            </ListItemIcon>
            <ListItemText primary="Користувачі" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  if (loading) {
    console.log('AdminPanelLayout: Still loading...');
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    console.log('AdminPanelLayout: No user data, returning null...');
    return null; // Не відображаємо нічого, поки перевіряємо авторизацію
  }

  console.log('AdminPanelLayout: Rendering admin panel layout...');
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Панель адміністратора
          </Typography>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Відкрити налаштування">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={`${user.firstName} ${user.lastName}`} src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleSettings}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <Typography textAlign="center">Налаштування</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <Typography textAlign="center">Вийти</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Краще для мобільної продуктивності.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default AdminPanelLayout;
