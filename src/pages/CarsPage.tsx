import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { uk } from 'date-fns/locale';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import SpeedIcon from '@mui/icons-material/Speed';

interface Car {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  seats: number;
  transmission: string;
  fuelType: string;
}

const cars: Car[] = [
  {
    id: 1,
    name: 'Toyota Camry',
    description: 'Комфортний седан бізнес-класу',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3',
    seats: 5,
    transmission: 'Автомат',
    fuelType: 'Бензин'
  },
  {
    id: 2,
    name: 'Volkswagen Golf',
    description: 'Економічний та надійний хетчбек',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3',
    seats: 5,
    transmission: 'Механіка',
    fuelType: 'Дизель'
  },
  {
    id: 3,
    name: 'Mercedes-Benz E-Class',
    description: 'Преміум седан для особливих випадків',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3',
    seats: 5,
    transmission: 'Автомат',
    fuelType: 'Бензин'
  },
  {
    id: 4,
    name: 'BMW X5',
    description: 'Розкішний та потужний позашляховик',
    price: 4000,
    image: 'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?ixlib=rb-4.0.3',
    seats: 7,
    transmission: 'Автомат',
    fuelType: 'Дизель'
  },
];

const CarsPage: React.FC = () => {
  const [openBooking, setOpenBooking] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [driverLicense, setDriverLicense] = useState('');
  const [additionalRequests, setAdditionalRequests] = useState('');

  const handleBookingOpen = (car: Car) => {
    setSelectedCar(car);
    setOpenBooking(true);
  };

  const handleBookingClose = () => {
    setOpenBooking(false);
    setSelectedCar(null);
  };

  const handleBookingSubmit = () => {
    // Тут буде логіка для обробки бронювання
    console.log({
      car: selectedCar,
      startDate,
      endDate,
      driverLicense,
      additionalRequests,
    });
    handleBookingClose();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Головна секція */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom className="section-title" sx={{ display: 'inline-block' }}>
          Оренда автомобілів
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Широкий вибір автомобілів для будь-яких потреб
        </Typography>
      </Box>

      {/* Список автомобілів */}
      <Grid container spacing={4}>
        {cars.map((car) => (
          <Grid item xs={12} sm={6} md={3} key={car.id}>
            <Card className="room-card">
              <CardMedia
                component="img"
                height="200"
                image={car.image}
                alt={car.name}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {car.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {car.description}
                </Typography>
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AirlineSeatReclineNormalIcon sx={{ mr: 1 }} color="action" />
                      <Typography variant="body2">{car.seats} місць</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocalGasStationIcon sx={{ mr: 1 }} color="action" />
                      <Typography variant="body2">{car.fuelType}</Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                  {car.price} грн/день
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleBookingOpen(car)}
                  startIcon={<DirectionsCarIcon />}
                >
                  Орендувати
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Діалог бронювання */}
      <Dialog open={openBooking} onClose={handleBookingClose} maxWidth="sm" fullWidth>
        <DialogTitle>Бронювання автомобіля</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {selectedCar && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {selectedCar.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedCar.price} грн/день
                </Typography>
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={uk}>
                <DatePicker
                  label="Дата початку"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={uk}>
                <DatePicker
                  label="Дата завершення"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Номер водійського посвідчення"
                value={driverLicense}
                onChange={(e) => setDriverLicense(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Додаткові побажання"
                multiline
                rows={4}
                value={additionalRequests}
                onChange={(e) => setAdditionalRequests(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBookingClose}>Скасувати</Button>
          <Button 
            onClick={handleBookingSubmit} 
            variant="contained"
            className="btn-animated"
          >
            Підтвердити
          </Button>
        </DialogActions>
      </Dialog>

      {/* Інформація про послуги */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom className="section-title" sx={{ display: 'inline-block' }}>
          Наші переваги
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <SpeedIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Швидке оформлення
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Мінімум документів та швидке оформлення оренди автомобіля
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <LocalGasStationIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Повний бак
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Всі автомобілі видаються з повним баком пального
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <DirectionsCarIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Технічна підтримка
              </Typography>
              <Typography variant="body2" color="text.secondary">
                24/7 підтримка та допомога на дорозі
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CarsPage;
