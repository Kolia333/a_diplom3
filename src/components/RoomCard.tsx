import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface RoomCardProps {
  id: number;
  title: string;
  description: string;
  price: number;
  capacity: number;
  imageUrl: string;
}

const RoomCard: React.FC<RoomCardProps> = ({
  id,
  title,
  description,
  price,
  capacity,
  imageUrl,
}) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate('/booking', { state: { roomId: id } });
  };

  return (
    <Card className="room-card">
      <CardMedia
        className="room-card-media"
        component="img"
        image={imageUrl}
        alt={title}
        height="200"
      />
      <CardContent className="room-card-content">
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body1" color="primary" fontWeight="bold">
            {price} грн / ніч
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Місткість: {capacity} осіб
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button 
          size="large" 
          color="primary" 
          variant="contained"
          fullWidth 
          onClick={handleBookNow}
          className="btn-animated"
        >
          Забронювати
        </Button>
      </CardActions>
    </Card>
  );
};

export default RoomCard;
