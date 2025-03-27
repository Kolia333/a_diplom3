import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid
} from '@mui/material';

interface FeatureProps {
  features: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
}

const FeatureSection: React.FC<FeatureProps> = ({ features }) => {
  return (
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
          Чому обирають нас
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: 3,
                  height: '100%',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)'
                  }
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeatureSection;
