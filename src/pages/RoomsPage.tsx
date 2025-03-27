import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import RoomCard from '../components/RoomCard';

// Моделюємо дані про номери (в реальному додатку ці дані будуть отримані з API)
const roomsData = [
  {
    id: 1,
    title: 'Стандартний одномісний',
    description: 'Комфортний стандартний номер з усіма зручностями для однієї особи.',
    price: 1200,
    capacity: 1,
    imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    type: 'standard',
  },
  {
    id: 2,
    title: 'Стандартний двомісний',
    description: 'Комфортний стандартний номер з усіма зручностями для двох осіб.',
    price: 1800,
    capacity: 2,
    imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    type: 'standard',
  },
  {
    id: 3,
    title: 'Люкс з видом на море',
    description: 'Розкішний номер з видом на море, окремою вітальнею та спальнею, ідеальний для пар.',
    price: 3000,
    capacity: 2,
    imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    type: 'luxury',
  },
  {
    id: 4,
    title: 'Сімейний люкс',
    description: 'Просторий номер для всієї родини з двома спальнями та зручностями для дітей.',
    price: 3500,
    capacity: 4,
    imageUrl: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    type: 'family',
  },
  {
    id: 5,
    title: 'Президентський люкс',
    description: 'Найрозкішніший номер у готелі з панорамними вікнами, джакузі та персональним обслуговуванням.',
    price: 6000,
    capacity: 2,
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    type: 'presidential',
  }
];

const RoomsPage: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value as string);
  };

  const filteredRooms = filter === 'all' 
    ? roomsData 
    : roomsData.filter(room => room.type === filter);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Наші номери
      </Typography>
      <Typography variant="body1" paragraph>
        Оберіть ідеальний номер для вашого перебування. Ми пропонуємо різноманітні варіанти для задоволення будь-яких потреб.
      </Typography>

      <Box sx={{ mb: 4, mt: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="room-type-filter-label">Тип номера</InputLabel>
          <Select
            labelId="room-type-filter-label"
            id="room-type-filter"
            value={filter}
            label="Тип номера"
            onChange={handleFilterChange}
          >
            <MenuItem value="all">Всі типи</MenuItem>
            <MenuItem value="standard">Стандарт</MenuItem>
            <MenuItem value="luxury">Люкс</MenuItem>
            <MenuItem value="family">Сімейний</MenuItem>
            <MenuItem value="presidential">Президентський</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={4}>
        {filteredRooms.map((room) => (
          <Grid item key={room.id} xs={12} sm={6} md={4}>
            <RoomCard
              id={room.id}
              title={room.title}
              description={room.description}
              price={room.price}
              capacity={room.capacity}
              imageUrl={room.imageUrl}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default RoomsPage;
