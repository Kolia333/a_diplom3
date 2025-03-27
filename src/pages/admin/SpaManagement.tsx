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
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { spaService } from '../../services';

interface ISpaService {
  _id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
}

const SpaManagement: React.FC = () => {
  const [services, setServices] = useState<ISpaService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<ISpaService> | null>(null);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // В реальному проєкті тут буде запит до API
      const data = await spaService.getAllServices();
      setServices(data);
      
      setLoading(false);
    } catch (err: any) {
      console.error('Помилка при завантаженні СПА-послуг:', err);
      setError('Не вдалося завантажити дані СПА-послуг. Спробуйте пізніше.');
      setLoading(false);
    }
  };

  const handleOpenDialog = (mode: 'add' | 'edit', service?: ISpaService) => {
    setDialogMode(mode);
    if (mode === 'edit' && service) {
      setCurrentService(service);
    } else {
      setCurrentService({
        title: '',
        description: '',
        duration: '',
        price: 0,
        image: '',
        category: '',
        isAvailable: false
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentService(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = e.target;
    
    if (name === 'isAvailable') {
      setCurrentService((prev) => prev ? { 
        ...prev, 
        isAvailable: value === 'available' 
      } : null);
    } else {
      setCurrentService((prev) => prev ? { ...prev, [name]: value } : null);
    }
  };

  const handleSaveService = async () => {
    if (!currentService || !currentService.title || !currentService.price) {
      return;
    }

    try {
      setLoading(true);
      
      if (dialogMode === 'add') {
        // В реальному проєкті тут буде запит до API
        const newService = await spaService.createService(currentService as ISpaService);
        setServices([...services, newService]);
      } else {
        // В реальному проєкті тут буде запит до API
        const updatedService = await spaService.updateService(
          currentService._id as string, 
          currentService as ISpaService
        );
        
        setServices(services.map(service => 
          service._id === currentService._id ? updatedService : service
        ));
      }
      
      handleCloseDialog();
    } catch (err: any) {
      console.error('Помилка при збереженні СПА-послуги:', err);
      setError('Не вдалося зберегти дані СПА-послуги. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (window.confirm('Ви впевнені, що хочете видалити цю СПА-послугу?')) {
      try {
        setLoading(true);
        
        // В реальному проєкті тут буде запит до API
        await spaService.deleteService(id);
        
        setServices(services.filter(service => service._id !== id));
        
        setLoading(false);
      } catch (err: any) {
        console.error('Помилка при видаленні СПА-послуги:', err);
        setError('Не вдалося видалити СПА-послугу. Спробуйте пізніше.');
        setLoading(false);
      }
    }
  };

  if (loading && services.length === 0) {
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
          Управління СПА-послугами
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('add')}
        >
          Додати послугу
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Таблиця СПА-послуг */}
      <TableContainer component={Paper} elevation={3} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Назва</TableCell>
              <TableCell>Тривалість</TableCell>
              <TableCell>Ціна (₴)</TableCell>
              <TableCell>Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service._id}>
                <TableCell>{service.title}</TableCell>
                <TableCell>{service.duration}</TableCell>
                <TableCell>{service.price.toLocaleString()}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog('edit', service)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteService(service._id)}
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
      
      {/* Картки СПА-послуг */}
      <Typography variant="h5" component="h2" gutterBottom>
        Перегляд карток СПА-послуг
      </Typography>
      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service._id}>
            <Card elevation={3}>
              <CardMedia
                component="img"
                height="200"
                image={service.image}
                alt={service.title}
              />
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {service.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1" color="text.primary">
                    {service.duration}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {service.price.toLocaleString()} ₴
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Діалог додавання/редагування СПА-послуги */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === 'add' ? 'Додати нову СПА-послугу' : 'Редагувати СПА-послугу'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Назва послуги"
                fullWidth
                value={currentService?.title || ''}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="duration"
                label="Тривалість (наприклад, 60 хв)"
                fullWidth
                value={currentService?.duration || ''}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="price"
                label="Ціна (₴)"
                type="number"
                fullWidth
                value={currentService?.price || ''}
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
                value={currentService?.description || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="image"
                label="URL зображення"
                fullWidth
                value={currentService?.image || ''}
                onChange={handleInputChange}
                helperText="Введіть URL зображення для СПА-послуги"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="category"
                label="Категорія послуги"
                fullWidth
                value={currentService?.category || ''}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Статус доступності</InputLabel>
                <Select
                  name="isAvailable"
                  value={currentService?.isAvailable ? 'available' : 'unavailable'}
                  onChange={handleInputChange}
                  label="Статус доступності"
                >
                  <MenuItem value="available">Доступна</MenuItem>
                  <MenuItem value="unavailable">Недоступна</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {currentService?.image && (
              <Grid item xs={12}>
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Перегляд зображення:
                  </Typography>
                  <Box
                    component="img"
                    sx={{
                      height: 200,
                      objectFit: 'cover',
                      width: '100%',
                      borderRadius: 1
                    }}
                    src={currentService.image}
                    alt="Перегляд зображення"
                  />
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Скасувати</Button>
          <Button
            onClick={handleSaveService}
            variant="contained"
            color="primary"
            disabled={!currentService?.title || !currentService?.price}
          >
            Зберегти
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SpaManagement;
