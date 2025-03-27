import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Button
} from '@mui/material';
import {
  Hotel as HotelIcon,
  EventNote as BookingIcon,
  Spa as SpaIcon,
  People as UsersIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as ConfirmedIcon,
  Cancel as CancelledIcon,
  HourglassEmpty as PendingIcon,
  CheckCircle
} from '@mui/icons-material';
import { roomService, bookingService, spaService, userService } from '../../services';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

// Інтерфейси для типізації
interface Room {
  id: number;
  name: string;
  type: string;
  price: number;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface Booking {
  id: number;
  user: User;
  room: Room;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

interface SpaService {
  id: number;
  title: string;
  price: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    rooms: 0,
    bookings: 0,
    spaServices: 0,
    users: 0,
    revenue: 0
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Отримуємо реальні дані з API
        const [rooms, bookings, spaServices, users] = await Promise.all([
          roomService.getAllRooms(),
          bookingService.getAllBookings(),
          spaService.getAllServices(),
          userService.getAllUsers()
        ]);

        // Розрахунок загальної виручки з усіх підтверджених бронювань
        const revenue = bookings
          .filter((booking: Booking) => booking.status === 'підтверджено' || booking.status === 'завершено')
          .reduce((total: number, booking: Booking) => total + booking.totalPrice, 0);

        // Встановлюємо статистику
        setStats({
          rooms: rooms.length,
          bookings: bookings.length,
          spaServices: spaServices.length,
          users: users.length,
          revenue
        });

        // Сортуємо бронювання за датою створення (від найновіших до найстаріших)
        const sortedBookings = [...bookings].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Беремо останні 5 бронювань
        setRecentBookings(sortedBookings.slice(0, 5));
        
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError('Помилка при завантаженні даних. Спробуйте пізніше.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Функція для відображення статусу бронювання
  const getStatusChip = (status: string) => {
    switch (status) {
      case 'підтверджено':
        return (
          <Chip 
            icon={<ConfirmedIcon />} 
            label="Підтверджено" 
            color="success" 
            size="small" 
            variant="outlined"
          />
        );
      case 'скасовано':
        return (
          <Chip 
            icon={<CancelledIcon />} 
            label="Скасовано" 
            color="error" 
            size="small" 
            variant="outlined"
          />
        );
      case 'очікує підтвердження':
        return (
          <Chip 
            icon={<PendingIcon />} 
            label="Очікує" 
            color="warning" 
            size="small" 
            variant="outlined"
          />
        );
      case 'завершено':
        return (
          <Chip 
            icon={<CheckCircle />} 
            label="Завершено" 
            color="info" 
            size="small" 
            variant="outlined"
          />
        );
      default:
        return (
          <Chip 
            label={status} 
            size="small" 
            variant="outlined"
          />
        );
    }
  };

  // Функція для форматування дати
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy', { locale: uk });
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" variant="h6">{error}</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Спробувати знову
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Панель адміністратора
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Статистика номерів */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                <HotelIcon />
              </Avatar>
              <Typography variant="h5" component="div">
                {stats.rooms}
              </Typography>
              <Typography color="text.secondary">
                Номерів
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Статистика бронювань */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 2 }}>
                <BookingIcon />
              </Avatar>
              <Typography variant="h5" component="div">
                {stats.bookings}
              </Typography>
              <Typography color="text.secondary">
                Бронювань
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Статистика СПА-послуг */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'info.main', mx: 'auto', mb: 2 }}>
                <SpaIcon />
              </Avatar>
              <Typography variant="h5" component="div">
                {stats.spaServices}
              </Typography>
              <Typography color="text.secondary">
                СПА-послуг
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Статистика користувачів */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 2 }}>
                <UsersIcon />
              </Avatar>
              <Typography variant="h5" component="div">
                {stats.users}
              </Typography>
              <Typography color="text.secondary">
                Користувачів
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Статистика виручки */}
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: 'warning.main', mx: 'auto', mb: 2 }}>
                <MoneyIcon />
              </Avatar>
              <Typography variant="h5" component="div">
                {stats.revenue.toLocaleString()} ₴
              </Typography>
              <Typography color="text.secondary">
                Загальна виручка
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Останні бронювання */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Останні бронювання
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {recentBookings.length > 0 ? (
          <List>
            {recentBookings.map((booking) => (
              <ListItem 
                key={booking.id}
                divider
                secondaryAction={getStatusChip(booking.status)}
              >
                <ListItemAvatar>
                  <Avatar>
                    <BookingIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body1">
                        {booking.user.firstName} {booking.user.lastName}
                      </Typography>
                    </Box>
                  } 
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        {booking.room.name}
                      </Typography>
                      {` — ${formatDate(booking.checkIn)} - ${formatDate(booking.checkOut)}, ${booking.totalPrice.toLocaleString()} ₴`}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
            Немає бронювань для відображення
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
