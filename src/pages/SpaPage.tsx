import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { Spa, Timer, LocalOffer, Check } from '@mui/icons-material';
import { spaService } from '../services';

// Інтерфейс для СПА послуги
interface ISpaService {
  _id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  image: string;
}

// Початкові дані для відображення під час завантаження
const initialSpaServices: ISpaService[] = [
  {
    _id: '1',
    title: 'Класичний масаж',
    description: 'Розслабляючий масаж всього тіла для зняття напруги та відновлення енергії',
    duration: '60 хв',
    price: 1000,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    _id: '2',
    title: 'Арома-терапія',
    description: 'Заспокійливий масаж з використанням ефірних олій для повного розслаблення',
    duration: '90 хв',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    _id: '3',
    title: 'Стоун-терапія',
    description: 'Масаж гарячими каменями для глибокого розслаблення м\'язів',
    duration: '90 хв',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    _id: '4',
    title: 'Спа-догляд для обличчя',
    description: 'Комплексний догляд за шкірою обличчя з використанням преміальної косметики',
    duration: '60 хв',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  }
];

const benefits = [
  'Професійні спа-терапевти',
  'Преміальна косметика',
  'Індивідуальний підхід',
  'Затишна атмосфера',
  'Сучасне обладнання',
  'Подарункові сертифікати'
];

const SpaPage: React.FC = () => {
  const navigate = useNavigate();
  const [openBookingDialog, setOpenBookingDialog] = useState(false);
  const [openContactDialog, setOpenContactDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [spaServices, setSpaServices] = useState<ISpaService[]>(initialSpaServices);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Завантаження СПА послуг з API при монтуванні компонента
  useEffect(() => {
    const fetchSpaServices = async () => {
      try {
        setLoading(true);
        const services = await spaService.getAllServices();
        setSpaServices(services);
        setError(null);
      } catch (err: any) {
        console.error('Помилка при завантаженні СПА послуг:', err);
        setError('Не вдалося завантажити СПА послуги. Спробуйте пізніше.');
        // Залишаємо початкові дані для відображення
      } finally {
        setLoading(false);
      }
    };

    fetchSpaServices();
  }, []);

  const handleBooking = (serviceTitle: string) => {
    setSelectedService(serviceTitle);
    setOpenBookingDialog(true);
  };

  const handleCloseBookingDialog = () => {
    setOpenBookingDialog(false);
  };

  const handleBookingSubmit = async () => {
    try {
      // Тут буде логіка бронювання через API
      const formData = {
        serviceId: spaServices.find(service => service.title === selectedService)?._id || '',
        date: document.getElementById('booking-date') ? (document.getElementById('booking-date') as HTMLInputElement).value : '',
        time: document.getElementById('booking-time') ? (document.getElementById('booking-time') as HTMLSelectElement).value : '',
        notes: document.getElementById('booking-notes') ? (document.getElementById('booking-notes') as HTMLTextAreaElement).value : ''
      };

      if (formData.serviceId && formData.date && formData.time) {
        await spaService.bookService(formData);
        setOpenBookingDialog(false);
        // Перенаправляємо на сторінку підтвердження
        navigate('/booking-confirmation');
      } else {
        alert('Будь ласка, заповніть всі обов\'язкові поля');
      }
    } catch (err) {
      console.error('Помилка при бронюванні:', err);
      alert('Не вдалося забронювати послугу. Спробуйте пізніше.');
    }
  };

  const handleContact = () => {
    setOpenContactDialog(true);
  };

  const handleCloseContactDialog = () => {
    setOpenContactDialog(false);
  };

  const handleContactSubmit = () => {
    // Тут буде логіка відправки форми
    setOpenContactDialog(false);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.2,
          }
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ position: 'relative', fontWeight: 'bold' }}>
            СПА та Велнес
          </Typography>
          <Typography variant="h5" align="center" paragraph sx={{ position: 'relative', maxWidth: 800, mx: 'auto' }}>
            Відкрийте для себе світ релаксації та відновлення. Наші спа-процедури допоможуть вам розслабитися та відновити сили.
          </Typography>
        </Container>
      </Box>

      {/* Services Section */}
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mb: 6 }}>
          Наші послуги
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center" sx={{ my: 4 }}>
            {error}
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {spaServices.map((service) => (
              <Grid item xs={12} md={6} key={service._id}>
                <Card sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  height: '100%',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  }
                }}>
                  <CardMedia
                    component="img"
                    sx={{
                      width: { sm: 200 },
                      height: { xs: 200, sm: 'auto' },
                    }}
                    image={service.image}
                    alt={service.title}
                  />
                  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h5" component="h3" gutterBottom>
                        {service.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {service.description}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                            <Timer sx={{ mr: 1, fontSize: 20 }} />
                            {service.duration}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocalOffer sx={{ mr: 1, fontSize: 20 }} />
                            {service.price} грн
                          </Typography>
                        </Grid>
                      </Grid>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        fullWidth 
                        sx={{ 
                          mt: 2,
                          transform: 'translateZ(0)',
                          transition: 'transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
                          '&:hover': {
                            transform: 'translate3d(0, -3px, 0)',
                            boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                          }
                        }}
                        onClick={() => handleBooking(service.title)}
                      >
                        Забронювати
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Benefits Section */}
        <Box sx={{ mt: 8, mb: 6 }}>
          <Typography variant="h4" component="h3" gutterBottom align="center" sx={{ mb: 4 }}>
            Чому обирають нас
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
                <CardContent>
                  <List>
                    {benefits.map((benefit, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemIcon>
                            <Check color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={benefit}
                            primaryTypographyProps={{
                              variant: 'h6',
                              sx: { fontSize: '1.1rem' }
                            }}
                          />
                        </ListItem>
                        {index < benefits.length - 1 && <Divider component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: '100%',
                  minHeight: 400,
                  borderRadius: 2,
                  overflow: 'hidden',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'url(https://images.unsplash.com/photo-1591343395082-e120087004b4?ixlib=rb-4.0.3)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'transform 0.3s ease-in-out',
                  },
                  '&:hover::before': {
                    transform: 'scale(1.05)',
                  }
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Contact Section */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h4" gutterBottom>
            Забронюйте свій спа-день
          </Typography>
          <Typography variant="body1" paragraph>
            Наші спеціалісти допоможуть підібрати ідеальну програму саме для вас
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<Spa />}
            sx={{ 
              mt: 2,
              transform: 'translateZ(0)',
              transition: 'transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translate3d(0, -3px, 0)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
              }
            }}
            onClick={handleContact}
          >
            Зв'язатися з нами
          </Button>
        </Box>
      </Container>

      {/* Діалогове вікно для бронювання */}
      <Dialog open={openBookingDialog} onClose={handleCloseBookingDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Бронювання процедури: {selectedService}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Ваше ім'я"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Телефон"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="booking-date"
                  label="Дата"
                  type="date"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Час</InputLabel>
                  <Select id="booking-time" label="Час">
                    <MenuItem value="10:00">10:00</MenuItem>
                    <MenuItem value="12:00">12:00</MenuItem>
                    <MenuItem value="14:00">14:00</MenuItem>
                    <MenuItem value="16:00">16:00</MenuItem>
                    <MenuItem value="18:00">18:00</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="booking-notes"
                  label="Додаткові побажання"
                  multiline
                  rows={3}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBookingDialog}>Скасувати</Button>
          <Button onClick={handleBookingSubmit} variant="contained" color="primary">
            Забронювати
          </Button>
        </DialogActions>
      </Dialog>

      {/* Діалогове вікно для контакту */}
      <Dialog open={openContactDialog} onClose={handleCloseContactDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Зв'язатися з нами</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Ваше ім'я"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Телефон"
                  fullWidth
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Повідомлення"
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseContactDialog}>Скасувати</Button>
          <Button onClick={handleContactSubmit} variant="contained" color="primary">
            Надіслати
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SpaPage;
