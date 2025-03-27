import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Chip,
  SelectChangeEvent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { roomService } from '../../services';

interface Room {
  _id: string;
  name: string;
  type: string;
  price: number;
  capacity: number;
  description: string;
  amenities: string[];
  images: string[];
  isAvailable: boolean;
}

const RoomsManagement: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Partial<Room> | null>(null);
  const [amenity, setAmenity] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // В реальному проєкті тут буде запит до API
      // const data = await roomService.getAllRooms();
      
      // Наразі використовуємо тестові дані
      setTimeout(() => {
        const mockRooms: Room[] = [
          {
            _id: '1',
            name: 'Стандартний одномісний',
            type: 'standard',
            price: 1200,
            capacity: 1,
            description: 'Комфортний номер для одного гостя з усіма необхідними зручностями.',
            amenities: ['Wi-Fi', 'Кондиціонер', 'Телевізор', 'Міні-бар'],
            images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a'],
            isAvailable: true
          },
          {
            _id: '2',
            name: 'Стандартний двомісний',
            type: 'standard',
            price: 1800,
            capacity: 2,
            description: 'Просторий номер з двома односпальними ліжками або одним двоспальним ліжком.',
            amenities: ['Wi-Fi', 'Кондиціонер', 'Телевізор', 'Міні-бар', 'Сейф'],
            images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427'],
            isAvailable: true
          },
          {
            _id: '3',
            name: 'Люкс з видом на море',
            type: 'luxury',
            price: 3000,
            capacity: 2,
            description: 'Розкішний номер з панорамним видом на море, окремою вітальнею та спальнею.',
            amenities: ['Wi-Fi', 'Кондиціонер', 'Телевізор', 'Міні-бар', 'Сейф', 'Джакузі', 'Балкон'],
            images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b'],
            isAvailable: true
          },
          {
            _id: '4',
            name: 'Сімейний люкс',
            type: 'family',
            price: 3500,
            capacity: 4,
            description: 'Просторий номер для сімейного відпочинку з двома спальнями та окремою вітальнею.',
            amenities: ['Wi-Fi', 'Кондиціонер', 'Телевізор', 'Міні-бар', 'Сейф', 'Кухонний куточок'],
            images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461'],
            isAvailable: true
          },
          {
            _id: '5',
            name: 'Президентський люкс',
            type: 'presidential',
            price: 6000,
            capacity: 2,
            description: 'Найрозкішніший номер готелю з панорамним видом, окремою вітальнею, спальнею та кабінетом.',
            amenities: ['Wi-Fi', 'Кондиціонер', 'Телевізор', 'Міні-бар', 'Сейф', 'Джакузі', 'Балкон', 'Кухня', 'Окрема їдальня'],
            images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304'],
            isAvailable: true
          }
        ];
        
        setRooms(mockRooms);
        setLoading(false);
      }, 1000);
      
    } catch (err: any) {
      console.error('Помилка при завантаженні номерів:', err);
      setError('Не вдалося завантажити дані номерів. Спробуйте пізніше.');
      setLoading(false);
    }
  };

  const handleOpenDialog = (mode: 'add' | 'edit', room?: Room) => {
    setDialogMode(mode);
    if (mode === 'edit' && room) {
      setCurrentRoom(room);
    } else {
      setCurrentRoom({
        name: '',
        type: 'standard',
        price: 0,
        capacity: 1,
        description: '',
        amenities: [],
        images: [],
        isAvailable: true
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentRoom(null);
    setAmenity('');
    setImageUrl('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string | 'available' | 'unavailable'>) => {
    const { name, value } = e.target;
    if (name) {
      if (name === 'isAvailable') {
        setCurrentRoom((prev) => prev ? { 
          ...prev, 
          isAvailable: value === 'available' 
        } : null);
      } else {
        setCurrentRoom((prev) => prev ? { ...prev, [name]: value } : null);
      }
    }
  };

  const handleAddAmenity = () => {
    if (amenity.trim() && currentRoom) {
      setCurrentRoom({
        ...currentRoom,
        amenities: [...(currentRoom.amenities || []), amenity.trim()]
      });
      setAmenity('');
    }
  };

  const handleRemoveAmenity = (index: number) => {
    if (currentRoom && currentRoom.amenities) {
      const newAmenities = [...currentRoom.amenities];
      newAmenities.splice(index, 1);
      setCurrentRoom({
        ...currentRoom,
        amenities: newAmenities
      });
    }
  };

  const handleAddImage = () => {
    if (imageUrl.trim() && currentRoom) {
      setCurrentRoom({
        ...currentRoom,
        images: [...(currentRoom.images || []), imageUrl.trim()]
      });
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    if (currentRoom && currentRoom.images) {
      const newImages = [...currentRoom.images];
      newImages.splice(index, 1);
      setCurrentRoom({
        ...currentRoom,
        images: newImages
      });
    }
  };

  const handleSaveRoom = async () => {
    if (!currentRoom || !currentRoom.name || !currentRoom.type || !currentRoom.price) {
      return;
    }

    try {
      setLoading(true);
      
      if (dialogMode === 'add') {
        // В реальному проєкті тут буде запит до API
        // const newRoom = await roomService.createRoom(currentRoom);
        
        // Імітація додавання нового номера
        const newRoom: Room = {
          ...currentRoom as Room,
          _id: Date.now().toString()
        };
        
        setRooms([...rooms, newRoom]);
      } else {
        // В реальному проєкті тут буде запит до API
        // const updatedRoom = await roomService.updateRoom(currentRoom._id, currentRoom);
        
        // Імітація оновлення номера
        const updatedRooms = rooms.map(room => 
          room._id === currentRoom._id ? { ...room, ...currentRoom } : room
        );
        
        setRooms(updatedRooms);
      }
      
      handleCloseDialog();
    } catch (err: any) {
      console.error('Помилка при збереженні номера:', err);
      setError('Не вдалося зберегти дані номера. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (id: string) => {
    if (window.confirm('Ви впевнені, що хочете видалити цей номер?')) {
      try {
        setLoading(true);
        
        // В реальному проєкті тут буде запит до API
        // await roomService.deleteRoom(id);
        
        // Імітація видалення номера
        setRooms(rooms.filter(room => room._id !== id));
        
        setLoading(false);
      } catch (err: any) {
        console.error('Помилка при видаленні номера:', err);
        setError('Не вдалося видалити номер. Спробуйте пізніше.');
        setLoading(false);
      }
    }
  };

  if (loading && rooms.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Управління номерами
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('add')}
        >
          Додати номер
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Назва</TableCell>
              <TableCell>Тип</TableCell>
              <TableCell>Ціна (₴)</TableCell>
              <TableCell>Місткість</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room._id}>
                <TableCell>{room.name}</TableCell>
                <TableCell>
                  {room.type === 'standard' && 'Стандартний'}
                  {room.type === 'luxury' && 'Люкс'}
                  {room.type === 'family' && 'Сімейний'}
                  {room.type === 'presidential' && 'Президентський'}
                </TableCell>
                <TableCell>{room.price.toLocaleString()}</TableCell>
                <TableCell>{room.capacity}</TableCell>
                <TableCell>
                  <Chip
                    label={room.isAvailable ? 'Доступний' : 'Недоступний'}
                    color={room.isAvailable ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog('edit', room)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteRoom(room._id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Діалог додавання/редагування номера */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === 'add' ? 'Додати новий номер' : 'Редагувати номер'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Назва номера"
                fullWidth
                value={currentRoom?.name || ''}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Тип номера</InputLabel>
                <Select
                  name="type"
                  value={currentRoom?.type || 'standard'}
                  onChange={handleInputChange}
                  label="Тип номера"
                >
                  <MenuItem value="standard">Стандартний</MenuItem>
                  <MenuItem value="luxury">Люкс</MenuItem>
                  <MenuItem value="family">Сімейний</MenuItem>
                  <MenuItem value="presidential">Президентський</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="price"
                label="Ціна за ніч (₴)"
                type="number"
                fullWidth
                value={currentRoom?.price || ''}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="capacity"
                label="Місткість (осіб)"
                type="number"
                fullWidth
                value={currentRoom?.capacity || ''}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Опис"
                multiline
                rows={4}
                fullWidth
                value={currentRoom?.description || ''}
                onChange={handleInputChange}
              />
            </Grid>
            
            {/* Зручності */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Зручності
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  label="Додати зручність"
                  value={amenity}
                  onChange={(e) => setAmenity(e.target.value)}
                  fullWidth
                />
                <Button
                  variant="contained"
                  onClick={handleAddAmenity}
                  sx={{ ml: 1, height: 56 }}
                >
                  Додати
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {currentRoom?.amenities?.map((item, index) => (
                  <Chip
                    key={index}
                    label={item}
                    onDelete={() => handleRemoveAmenity(index)}
                  />
                ))}
              </Box>
            </Grid>
            
            {/* Зображення */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Зображення
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  label="URL зображення"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  fullWidth
                />
                <Button
                  variant="contained"
                  onClick={handleAddImage}
                  sx={{ ml: 1, height: 56 }}
                >
                  Додати
                </Button>
              </Box>
              <Grid container spacing={2}>
                {currentRoom?.images?.map((url, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <Paper
                      elevation={2}
                      sx={{
                        position: 'relative',
                        height: 120,
                        backgroundImage: `url(${url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 5,
                          right: 5,
                          bgcolor: 'rgba(255,255,255,0.7)'
                        }}
                        onClick={() => handleRemoveImage(index)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Статус</InputLabel>
                <Select
                  name="isAvailable"
                  value={currentRoom?.isAvailable === undefined ? 'available' : currentRoom.isAvailable ? 'available' : 'unavailable'}
                  onChange={handleInputChange as any}
                  label="Статус"
                >
                  <MenuItem value="available">Доступний</MenuItem>
                  <MenuItem value="unavailable">Недоступний</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Скасувати</Button>
          <Button
            onClick={handleSaveRoom}
            variant="contained"
            color="primary"
            disabled={!currentRoom?.name || !currentRoom?.type || !currentRoom?.price}
          >
            Зберегти
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoomsManagement;
