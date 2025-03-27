import React, { lazy, Suspense, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Stack,
  ImageList,
  ImageListItem,
  Chip,
  Paper,
  CircularProgress
} from '@mui/material';
import HotelIcon from '@mui/icons-material/Hotel';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SpaIcon from '@mui/icons-material/Spa';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import RoomServiceIcon from '@mui/icons-material/RoomService';

// Оптимізовані константи винесені за межі компонента
const SERVICES = [
  {
    title: 'Готель',
    icon: <HotelIcon sx={{ fontSize: 40 }} />,
    description: 'Розкішні номери та люкси з панорамними видами',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    path: '/rooms'
  },
  {
    title: 'Ресторан',
    icon: <RestaurantIcon sx={{ fontSize: 40 }} />,
    description: 'Вишукана кухня та атмосфера',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    path: '/restaurant'
  },
  {
    title: 'СПА центр',
    icon: <SpaIcon sx={{ fontSize: 40 }} />,
    description: 'Релаксація та відновлення',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    path: '/spa'
  },
  {
    title: 'Оренда авто',
    icon: <DirectionsCarIcon sx={{ fontSize: 40 }} />,
    description: 'Преміум автомобілі для вашої подорожі',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    path: '/cars'
  }
];

const GALLERY_ITEMS = [
  {
    img: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=70',
    title: 'Розкішний номер'
  },
  {
    img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=70',
    title: 'Ресторан'
  },
  {
    img: 'https://images.unsplash.com/photo-1561501878-aabd62634533?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=70',
    title: 'Басейн'
  },
  {
    img: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=70',
    title: 'Спа центр'
  },
  {
    img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=70',
    title: 'Конференц-зал'
  },
  {
    img: 'https://images.unsplash.com/photo-1615460549969-36fa19521a4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=70',
    title: 'Тераса'
  }
];

const SPECIAL_OFFERS = [
  {
    title: 'Романтичний вікенд',
    description: 'Проведіть незабутній вікенд удвох. Включає сніданок, вечерю при свічках та спа-процедури',
    price: 'від 2500 грн/ніч',
    tag: 'Популярне'
  },
  {
    title: 'Сімейний відпочинок',
    description: 'Спеціальна пропозиція для сімей з дітьми. Включає дитяче меню та розваги',
    price: 'від 3000 грн/ніч',
    tag: 'Для сім\'ї'
  },
  {
    title: 'Довготривале проживання',
    description: 'Знижка 20% при бронюванні від 7 ночей. Включає всі послуги готелю',
    price: 'від 2000 грн/ніч',
    tag: 'Економія'
  }
];

const HOTEL_FEATURES = [
  {
    icon: <LocationOnIcon sx={{ fontSize: 40 }} />,
    title: 'Ідеальне розташування',
    description: 'У самому центрі міста, поруч з основними пам\'ятками та зручною транспортною розв\'язкою'
  },
  {
    icon: <WifiIcon sx={{ fontSize: 40 }} />,
    title: 'Сучасні технології',
    description: 'Безкоштовний високошвидкісний Wi-Fi та розумні системи управління кімнатою'
  },
  {
    icon: <LocalParkingIcon sx={{ fontSize: 40 }} />,
    title: 'Безкоштовний паркінг',
    description: 'Просторий підземний паркінг з охороною та відеоспостереженням'
  },
  {
    icon: <RoomServiceIcon sx={{ fontSize: 40 }} />,
    title: 'Цілодобовий сервіс',
    description: 'Обслуговування номерів та консьєрж-сервіс 24/7'
  }
];

// Мемоізовані компоненти для оптимізації рендерингу
const ServiceCard = memo(({ service, onClick }: { service: { title: string; icon: React.ReactNode; description: string; image: string; path: string }; onClick: () => void }) => (
  <Card
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-8px)',
        cursor: 'pointer'
      }
    }}
    onClick={onClick}
  >
    <CardMedia
      component="img"
      height="200"
      image={service.image}
      alt={service.title}
      loading="lazy"
    />
    <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
      <Box sx={{ color: 'primary.main', mb: 2 }}>
        {service.icon}
      </Box>
      <Typography
        gutterBottom
        variant="h5"
        component="h2"
        sx={{ fontWeight: 600 }}
      >
        {service.title}
      </Typography>
      <Typography color="text.secondary">
        {service.description}
      </Typography>
    </CardContent>
  </Card>
));

const GallerySection = memo(() => (
  <Box sx={{ py: 8, backgroundColor: 'background.paper' }}>
    <Container>
      <Typography
        variant="h3"
        align="center"
        sx={{
          mb: 6,
          fontWeight: 600,
          fontSize: { xs: '2rem', md: '2.75rem' }
        }}
      >
        Наша галерея
      </Typography>
      <ImageList
        sx={{
          width: '100%',
          height: 450,
          transform: 'translateZ(0)',
        }}
        rowHeight={300}
        gap={8}
        cols={3}
      >
        {GALLERY_ITEMS.map((item) => (
          <ImageListItem key={item.img}>
            <img
              src={item.img}
              alt={item.title}
              loading="lazy"
              style={{
                borderRadius: '8px',
                height: '100%',
                width: '100%',
                objectFit: 'cover'
              }}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Container>
  </Box>
));

const SpecialOfferCard = memo(({ offer, onBookClick }: { offer: { title: string; description: string; price: string; tag: string }; onBookClick: () => void }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      transition: 'transform 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-8px)'
      }
    }}
  >
    <Chip
      label={offer.tag}
      color="primary"
      size="small"
      sx={{
        position: 'absolute',
        top: 16,
        right: 16
      }}
    />
    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
      {offer.title}
    </Typography>
    <Typography variant="body1" sx={{ mb: 3, flexGrow: 1 }}>
      {offer.description}
    </Typography>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
        {offer.price}
      </Typography>
      <Button variant="outlined" onClick={onBookClick}>
        Забронювати
      </Button>
    </Box>
  </Paper>
));

// Ліниве завантаження важких секцій
const LazyFeatureSection = lazy(() => import('../components/FeatureSection'));
const LazyCTASection = lazy(() => import('../components/CTASection'));

const HomePage = () => {
  const navigate = useNavigate();

  const handleBooking = () => {
    navigate('/booking');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          height: 'calc(100vh - 64px)', 
          width: '100vw',
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-start', 
          overflow: 'hidden',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          marginTop: '-64px', 
          paddingTop: '64px', 
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=70)',
            backgroundSize: 'cover',
            backgroundPosition: 'top center', 
            backgroundRepeat: 'no-repeat',
            zIndex: -1
          }
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '1200px',
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 4 }
          }}
        >
          <Box
            sx={{
              color: 'white',
              textAlign: { xs: 'center', md: 'left' },
              maxWidth: { xs: '100%', md: '50%' },
              py: { xs: 4, md: 6 }, 
              mt: 0 
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
                fontWeight: 700,
                mb: 3,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                lineHeight: 1.1
              }}
            >
              Відчуйте справжню розкіш
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.2rem' },
                mb: 4,
                fontWeight: 300,
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                lineHeight: 1.3
              }}
            >
              Ексклюзивний готель з неперевершеним сервісом
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              justifyContent={{ xs: 'center', md: 'flex-start' }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={handleBooking}
                sx={{
                  py: 2,
                  px: 6,
                  fontSize: '1.2rem',
                  backgroundColor: 'primary.main',
                  transform: 'translateZ(0)',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                    transform: 'translate3d(0, -3px, 0)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                  },
                  transition: 'transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease'
                }}
              >
                Забронювати номер
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => handleNavigate('/rooms')}
                sx={{
                  py: 2,
                  px: 6,
                  fontSize: '1.2rem',
                  color: 'white',
                  borderColor: 'white',
                  borderWidth: 2,
                  transform: 'translateZ(0)',
                  '&:hover': {
                    borderColor: 'white',
                    borderWidth: 2,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    transform: 'translate3d(0, -3px, 0)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                  },
                  transition: 'transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease'
                }}
              >
                Наші номери
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Services Section */}
      <Box sx={{ py: 8, backgroundColor: 'background.paper' }}>
        <Container>
          <Typography
            variant="h2"
            align="center"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              mb: 6,
              fontWeight: 600
            }}
          >
            Наші послуги
          </Typography>
          <Grid container spacing={4}>
            {SERVICES.map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <ServiceCard 
                  service={service} 
                  onClick={() => handleNavigate(service.path)} 
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Gallery Section - мемоізований компонент */}
      <GallerySection />

      {/* Special Offers Section */}
      <Box sx={{ py: 8, backgroundColor: '#f5f5f5' }}>
        <Container>
          <Typography
            variant="h3"
            align="center"
            sx={{
              mb: 6,
              fontWeight: 600,
              fontSize: { xs: '2rem', md: '2.75rem' }
            }}
          >
            Спеціальні пропозиції
          </Typography>
          <Grid container spacing={4}>
            {SPECIAL_OFFERS.map((offer, index) => (
              <Grid item xs={12} md={4} key={index}>
                <SpecialOfferCard 
                  offer={offer} 
                  onBookClick={handleBooking} 
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Ліниве завантаження важких компонентів */}
      <Suspense fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      }>
        <LazyFeatureSection features={HOTEL_FEATURES} />
        <LazyCTASection onBookClick={handleBooking} />
      </Suspense>
    </Box>
  );
};

export default HomePage;
