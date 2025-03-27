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
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { uk } from 'date-fns/locale';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import GroupsIcon from '@mui/icons-material/Groups';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TableBooking from '../components/TableBooking';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Стейк Рібай',
    description: 'Соковитий стейк з мармурової яловичини з овочами гриль',
    price: 750,
    category: 'Основні страви',
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3'
  },
  {
    id: 2,
    name: 'Паста Карбонара',
    description: 'Класична італійська паста з беконом та вершковим соусом',
    price: 320,
    category: 'Основні страви',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3'
  },
  {
    id: 3,
    name: 'Цезар з креветками',
    description: 'Салат з тигровими креветками, пармезаном та соусом',
    price: 380,
    category: 'Салати',
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3'
  },
  {
    id: 4,
    name: 'Тірамісу',
    description: 'Класичний італійський десерт з кавовим смаком',
    price: 180,
    category: 'Десерти',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3'
  },
];

const RestaurantPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [openBooking, setOpenBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [guests, setGuests] = useState('2');
  const [specialRequests, setSpecialRequests] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleBookingOpen = () => {
    setOpenBooking(true);
  };

  const handleBookingClose = () => {
    setOpenBooking(false);
  };

  const handleBookingSubmit = () => {
    // Тут буде логіка для обробки бронювання
    console.log({
      date: selectedDate,
      time: selectedTime,
      guests,
      specialRequests,
    });
    handleBookingClose();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Ресторан
      </Typography>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Меню" />
          <Tab label="Бронювання столиків" />
        </Tabs>
      </Paper>

      {activeTab === 0 ? (
        <>
          <Grid container spacing={4}>
            {menuItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.image}
                    alt={item.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                      {item.price} грн
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleBookingOpen}
              startIcon={<RestaurantIcon />}
              className="btn-animated"
            >
              Забронювати столик
            </Button>
          </Box>
        </>
      ) : (
        <TableBooking />
      )}
      <Dialog open={openBooking} onClose={handleBookingClose} maxWidth="sm" fullWidth>
        <DialogTitle>Бронювання столика</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={uk}>
                <DatePicker
                  label="Дата"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={uk}>
                <TimePicker
                  label="Час"
                  value={selectedTime}
                  onChange={(newValue) => setSelectedTime(newValue)}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="guests-label">Кількість гостей</InputLabel>
                <Select
                  labelId="guests-label"
                  value={guests}
                  label="Кількість гостей"
                  onChange={(e) => setGuests(e.target.value)}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num} {num === 1 ? 'гість' : num < 5 ? 'гостя' : 'гостей'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Особливі побажання"
                multiline
                rows={4}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
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
    </Container>
  );
};

export default RestaurantPage;
