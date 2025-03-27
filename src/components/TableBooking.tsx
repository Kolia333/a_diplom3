import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Dialog, DialogTitle, 
         DialogContent, DialogActions, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

interface TableData {
  id: number;
  seats: number;
  isBooked: boolean;
  position: { x: number; y: number };
}

const TableItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  cursor: 'pointer',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const TableBooking: React.FC = () => {
  const [tables] = useState<TableData[]>([
    // Зона 1 - Біля вікна
    { id: 1, seats: 2, isBooked: false, position: { x: 50, y: 50 } },
    { id: 2, seats: 2, isBooked: false, position: { x: 150, y: 50 } },
    { id: 3, seats: 4, isBooked: false, position: { x: 250, y: 50 } },
    { id: 4, seats: 4, isBooked: false, position: { x: 350, y: 50 } },
    
    // Зона 2 - Центральна
    { id: 5, seats: 6, isBooked: false, position: { x: 50, y: 150 } },
    { id: 6, seats: 6, isBooked: false, position: { x: 150, y: 150 } },
    { id: 7, seats: 8, isBooked: false, position: { x: 250, y: 150 } },
    { id: 8, seats: 4, isBooked: false, position: { x: 350, y: 150 } },
    
    // Зона 3 - Затишний куточок
    { id: 9, seats: 2, isBooked: false, position: { x: 50, y: 250 } },
    { id: 10, seats: 2, isBooked: false, position: { x: 150, y: 250 } },
    { id: 11, seats: 4, isBooked: false, position: { x: 250, y: 250 } },
    
    // Зона 4 - VIP зона
    { id: 12, seats: 8, isBooked: false, position: { x: 50, y: 350 } },
    { id: 13, seats: 6, isBooked: false, position: { x: 200, y: 350 } },
    { id: 14, seats: 4, isBooked: false, position: { x: 350, y: 350 } },
    
    // Зона 5 - Барна стійка
    { id: 15, seats: 2, isBooked: false, position: { x: 450, y: 150 } },
  ]);

  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    date: '',
    time: '',
  });

  const handleTableClick = (table: TableData) => {
    if (!table.isBooked) {
      setSelectedTable(table);
      setOpenDialog(true);
    }
  };

  const handleBooking = () => {
    // Here you would typically make an API call to your backend
    console.log('Booking details:', { table: selectedTable, ...bookingDetails });
    setOpenDialog(false);
    setSelectedTable(null);
    setBookingDetails({ name: '', date: '', time: '' });
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '500px', border: '1px solid #ccc', borderRadius: '8px', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Схема розташування столиків
        </Typography>
        
        {/* Легенда */}
        <Box sx={{ display: 'flex', gap: 3, backgroundColor: '#f5f5f5', p: 1, borderRadius: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 16, height: 16, bgcolor: '#c8e6c9', borderRadius: 1 }} />
            <Typography variant="body2">Вільно</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 16, height: 16, bgcolor: '#ffcdd2', borderRadius: 1 }} />
            <Typography variant="body2">Заброньовано</Typography>
          </Box>
        </Box>
      </Box>
      
      {tables.map((table) => (
        <TableItem
          key={table.id}
          sx={{
            left: table.position.x,
            top: table.position.y,
            bgcolor: table.isBooked ? '#ffcdd2' : '#c8e6c9',
            width: table.seats >= 6 ? '80px' : '60px',
            height: table.seats >= 6 ? '80px' : '60px',
          }}
          onClick={() => handleTableClick(table)}
        >
          <Typography variant="body2">
            {`${table.seats} місць`}
          </Typography>
        </TableItem>
      ))}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Бронювання столика</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Столик №{selectedTable?.id} ({selectedTable?.seats} місць)
          </Typography>
          <TextField
            fullWidth
            label="Ім'я"
            margin="normal"
            value={bookingDetails.name}
            onChange={(e) => setBookingDetails({ ...bookingDetails, name: e.target.value })}
          />
          <TextField
            fullWidth
            label="Дата"
            type="date"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={bookingDetails.date}
            onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })}
          />
          <TextField
            fullWidth
            label="Час"
            type="time"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={bookingDetails.time}
            onChange={(e) => setBookingDetails({ ...bookingDetails, time: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Скасувати</Button>
          <Button onClick={handleBooking} variant="contained" color="primary">
            Забронювати
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TableBooking;
