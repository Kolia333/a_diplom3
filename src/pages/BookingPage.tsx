import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ukLocale from 'date-fns/locale/uk';
import { addDays, format } from 'date-fns';
import { bookingService } from '../services/bookingService';
import { Snackbar, Alert } from '@mui/material';

const roomsData = [
  {
    id: 1,
    title: 'Стандартний номер',
    price: 1200,
  },
  {
    id: 2,
    title: 'Люкс',
    price: 2500,
  },
  {
    id: 3,
    title: 'Сімейний номер',
    price: 3000,
  },
  {
    id: 4,
    title: 'Економ номер',
    price: 800,
  },
  {
    id: 5,
    title: 'Апартаменти',
    price: 3500,
  },
  {
    id: 6,
    title: 'Бізнес номер',
    price: 2000,
  },
];

interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roomId: number;
  checkIn: Date | null;
  checkOut: Date | null;
  adults: number;
  children: number;
  specialRequests: string;
}

const BookingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const preselectedRoomId = location.state?.roomId || 1;

  const [formData, setFormData] = useState<BookingFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    roomId: preselectedRoomId,
    checkIn: null,
    checkOut: null,
    adults: 1,
    children: 0,
    specialRequests: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'roomId' ? Number(value) : value,
    });
  };

  const handleDateChange = (name: string, date: Date | null) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.firstName) errors.firstName = 'Введіть ім\'я';
    if (!formData.lastName) errors.lastName = 'Введіть прізвище';
    if (!formData.email) {
      errors.email = 'Введіть email';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Невірний формат email';
    }
    if (!formData.phone) {
      errors.phone = 'Введіть номер телефону';
    }
    if (!formData.checkIn) errors.checkIn = 'Виберіть дату заїзду';
    if (!formData.checkOut) errors.checkOut = 'Виберіть дату виїзду';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateTotalPrice = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    
    const room = roomsData.find(r => r.id === formData.roomId);
    if (!room) return 0;
    
    const nights = Math.ceil(
      (formData.checkOut.getTime() - formData.checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return room.price * nights;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      console.log('Відправляємо дані бронювання:', formData);
      bookingService.bookRoom(formData)
        .then((response) => {
          console.log('Бронювання успішно створено:', response);
          setIsSubmitted(true);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Помилка при створенні бронювання:', error);
          setError(error.message || 'Помилка при створенні бронювання');
          setShowError(true);
          setIsLoading(false);
        });
    }
  };

  const selectedRoom = roomsData.find(room => room.id === formData.roomId);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, bgcolor: 'background.paper' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          Бронювання номера
        </Typography>

        {isSubmitted ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom color="primary">
              Дякуємо за бронювання!
            </Typography>
            <Typography variant="body1" paragraph>
              Ваше бронювання успішно оформлено. Ми надіслали підтвердження на вашу електронну пошту: {formData.email}
            </Typography>
            <Box sx={{ 
              bgcolor: 'background.default', 
              p: 3, 
              borderRadius: 2,
              mt: 3,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <Typography variant="h6" gutterBottom>
                Деталі бронювання:
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Номер:</strong> {selectedRoom?.title}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Дата заїзду:</strong> {formData.checkIn?.toLocaleDateString('uk-UA')}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Дата виїзду:</strong> {formData.checkOut?.toLocaleDateString('uk-UA')}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Кількість гостей:</strong> {formData.adults} дорослих, {formData.children} дітей
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                    Загальна вартість: {calculateTotalPrice()} грн
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 4 }}
              onClick={() => setIsSubmitted(false)}
            >
              Зробити нове бронювання
            </Button>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ім'я"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={!!formErrors.firstName}
                  helperText={formErrors.firstName}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Прізвище"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={!!formErrors.lastName}
                  helperText={formErrors.lastName}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Телефон"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={!!formErrors.phone}
                  helperText={formErrors.phone}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Тип номера</InputLabel>
                  <Select
                    name="roomId"
                    value={formData.roomId.toString()}
                    onChange={handleSelectChange}
                    label="Тип номера"
                  >
                    {roomsData.map((room) => (
                      <MenuItem key={room.id} value={room.id}>
                        {room.title} - {room.price} грн/ніч
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ukLocale}>
                  <DatePicker
                    label="Дата заїзду"
                    value={formData.checkIn}
                    onChange={(date) => handleDateChange('checkIn', date)}
                    minDate={new Date()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!formErrors.checkIn,
                        helperText: formErrors.checkIn
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ukLocale}>
                  <DatePicker
                    label="Дата виїзду"
                    value={formData.checkOut}
                    onChange={(date) => handleDateChange('checkOut', date)}
                    minDate={formData.checkIn ? addDays(formData.checkIn, 1) : new Date()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!formErrors.checkOut,
                        helperText: formErrors.checkOut
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Дорослих</InputLabel>
                  <Select
                    name="adults"
                    value={formData.adults.toString()}
                    onChange={handleSelectChange}
                    label="Дорослих"
                  >
                    {[1, 2, 3, 4].map((num) => (
                      <MenuItem key={num} value={num}>
                        {num}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Дітей</InputLabel>
                  <Select
                    name="children"
                    value={formData.children.toString()}
                    onChange={handleSelectChange}
                    label="Дітей"
                  >
                    {[0, 1, 2, 3].map((num) => (
                      <MenuItem key={num} value={num}>
                        {num}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Спеціальні побажання"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary">
                    Загальна вартість: {calculateTotalPrice()} грн
                  </Typography>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ minWidth: 200 }}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Відправлення...' : 'Забронювати'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        )}
        {showError && (
          <Snackbar
            open={showError}
            autoHideDuration={6000}
            onClose={() => setShowError(false)}
          >
            <Alert severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          </Snackbar>
        )}
      </Paper>
    </Container>
  );
};

export default BookingPage;
