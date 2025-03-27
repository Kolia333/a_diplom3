import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button
} from '@mui/material';

interface CTASectionProps {
  onBookClick: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onBookClick }) => {
  return (
    <Box
      sx={{
        py: 8,
        color: 'white',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)), url(https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=70)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          zIndex: -1
        }
      }}
    >
      <Container>
        <Box
          sx={{
            textAlign: 'center',
            maxWidth: 800,
            mx: 'auto'
          }}
        >
          <Typography
            variant="h3"
            sx={{
              mb: 3,
              fontSize: { xs: '2rem', md: '2.75rem' },
              fontWeight: 600
            }}
          >
            Готові до незабутнього відпочинку?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              fontWeight: 300,
              fontSize: { xs: '1.1rem', md: '1.3rem' }
            }}
          >
            Забронюйте свій номер прямо зараз та отримайте спеціальні пропозиції
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={onBookClick}
            sx={{
              py: 2,
              px: 6,
              fontSize: '1.1rem'
            }}
          >
            Забронювати зараз
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default CTASection;
