import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[200],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1" align="center">
          © {new Date().getFullYear()} Бронювання готелю. Усі права захищено.
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          <Link color="inherit" href="#">
            Умови використання
          </Link>
          {' | '}
          <Link color="inherit" href="#">
            Політика конфіденційності
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
