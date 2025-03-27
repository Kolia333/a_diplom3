import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Hotel as HotelIcon,
  EventNote as BookingIcon,
  Spa as SpaIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import api from '../../services/api';

interface Booking {
  id: number;
  roomId: number;
  userId: number;
  checkIn: string;
  checkOut: string;
  status: string;
  createdAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  room: {
    id: number;
    name: string;
    type: string;
  };
}

const AdminPanelDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    rooms: 0,
    bookings: 0,
    users: 0,
    spaServices: 0
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('AdminPanelDashboard: Fetching dashboard data...');
        setLoading(true);
        
        // Отримуємо статистику
        const roomsResponse = await api.get('/rooms/count');
        const bookingsResponse = await api.get('/bookings/count');
        const usersResponse = await api.get('/users/count');
        const spaResponse = await api.get('/spa-services/count');
        
        setStats({
          rooms: roomsResponse.data.count || 0,
          bookings: bookingsResponse.data.count || 0,
          users: usersResponse.data.count || 0,
          spaServices: spaResponse.data.count || 0
        });
        
        // Отримуємо останні бронювання
        const bookingsResponse2 = await api.get('/bookings/recent');
        setRecentBookings(bookingsResponse2.data || []);
        
        console.log('AdminPanelDashboard: Data fetched successfully');
      } catch (error) {
        console.error('AdminPanelDashboard: Error fetching data:', error);
        
        // Якщо API недоступне, використовуємо тестові дані
        console.log('AdminPanelDashboard: Using mock data');
        
        setStats({
          rooms: 10,
          bookings: 25,
          users: 15,
          spaServices: 8
        });
        
        setRecentBookings([
          {
            id: 1,
            roomId: 1,
            userId: 2,
            checkIn: '2025-04-01',
            checkOut: '2025-04-05',
            status: 'confirmed',
            createdAt: '2025-03-15',
            user: {
              id: 2,
              firstName: 'Іван',
              lastName: 'Петренко',
              email: 'user@example.com'
            },
            room: {
              id: 1,
              name: 'Люкс',
              type: 'suite'
            }
          },
          {
            id: 2,
            roomId: 2,
            userId: 3,
            checkIn: '2025-04-10',
            checkOut: '2025-04-15',
            status: 'pending',
            createdAt: '2025-03-20',
            user: {
              id: 3,
              firstName: 'Марія',
              lastName: 'Коваленко',
              email: 'maria@example.com'
            },
            room: {
              id: 2,
              name: 'Стандарт',
              type: 'standard'
            }
          },
          {
            id: 3,
            roomId: 3,
            userId: 4,
            checkIn: '2025-04-05',
            checkOut: '2025-04-07',
            status: 'confirmed',
            createdAt: '2025-03-22',
            user: {
              id: 4,
              firstName: 'Олександр',
              lastName: 'Шевченко',
              email: 'alex@example.com'
            },
            room: {
              id: 3,
              name: 'Сімейний',
              type: 'family'
            }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Підтверджено';
      case 'pending':
        return 'Очікує';
      case 'cancelled':
        return 'Скасовано';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Панель управління
      </Typography>
      
      <Grid container spacing={3}>
        {/* Статистика */}
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <HotelIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h5" component="div">
                {stats.rooms}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Номерів
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <BookingIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h5" component="div">
                {stats.bookings}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Бронювань
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <PeopleIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h5" component="div">
                {stats.users}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Користувачів
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <SpaIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h5" component="div">
                {stats.spaServices}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                СПА-послуг
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Останні бронювання */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom component="div">
              Останні бронювання
            </Typography>
            <List>
              {recentBookings.length > 0 ? (
                recentBookings.map((booking, index) => (
                  <React.Fragment key={booking.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1">
                              {booking.room.name} - {booking.user.firstName} {booking.user.lastName}
                            </Typography>
                            <Chip 
                              label={getStatusText(booking.status)} 
                              color={getStatusColor(booking.status) as any} 
                              size="small" 
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2">
                              Email: {booking.user.email}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < recentBookings.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="Немає бронювань" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminPanelDashboard;
