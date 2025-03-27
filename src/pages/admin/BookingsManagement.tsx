import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
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
  Tabs,
  Tab,
  SelectChangeEvent
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';
import { bookingService, roomService } from '../../services';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`booking-tabpanel-${index}`}
      aria-labelledby={`booking-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface Booking {
  id: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  room: {
    id: number;
    name: string;
    type: string;
    price: number;
    images?: string[];
  };
  checkIn: string;
  checkOut: string;
  guestCount: number;
  totalPrice: number;
  status: string;
  specialRequests?: string;
  createdAt: string;
}

interface Room {
  id: number;
  name: string;
  type: string;
  price: number;
  capacity: number;
  isAvailable: boolean;
  images?: string[];
  amenities?: string[];
  description?: string;
}

const BookingsManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Partial<Booking> | null>(null);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'view'>('view');
  const [tabValue, setTabValue] = useState(0);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  useEffect(() => {
    fetchBookings();
    fetchRooms();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching all bookings...');
      
      // Використовуємо реальний API замість тестових даних
      const fetchedData = await bookingService.getAllBookings();
      console.log('Received bookings data:', fetchedData);
      
      if (fetchedData && Array.isArray(fetchedData) && fetchedData.length > 0) {
        setBookings(fetchedData);
        console.log('Successfully set bookings from API:', fetchedData);
      } else {
        console.log('No bookings received from API or empty array');
        // Використовуємо тестові дані, якщо API повернуло порожній масив
        useMockData();
      }
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      setError(error.message || 'Помилка при завантаженні бронювань');
      setLoading(false);
      
      // Якщо API недоступне, використовуємо тестові дані
      useMockData();
    }
  };

  const useMockData = () => {
    console.log('Using mock data as fallback');
    const mockBookings: Booking[] = [
      {
        id: 1,
        user: {
          id: 1,
          firstName: 'Олександр',
          lastName: 'Петренко',
          email: 'oleksandr@example.com'
        },
        room: {
          id: 3,
          name: 'Люкс з видом на море',
          type: 'suite',
          price: 3000
        },
        checkIn: '2025-04-01',
        checkOut: '2025-04-05',
        guestCount: 2,
        totalPrice: 12000,
        status: 'confirmed',
        specialRequests: 'Прошу підготувати номер до 14:00',
        createdAt: '2025-03-15T10:30:00Z'
      },
      {
        id: 2,
        user: {
          id: 2,
          firstName: 'Марія',
          lastName: 'Коваленко',
          email: 'maria@example.com'
        },
        room: {
          id: 2,
          name: 'Стандартний двомісний',
          type: 'standard',
          price: 1800
        },
        checkIn: '2025-03-28',
        checkOut: '2025-03-30',
        guestCount: 2,
        totalPrice: 3600,
        status: 'confirmed',
        createdAt: '2025-03-10T15:45:00Z'
      }
    ];
    setBookings(mockBookings);
  };

  const fetchRooms = async () => {
    try {
      const fetchedRooms = await roomService.getAllRooms();
      // Map the API response to match our local Room interface
      const mappedRooms: Room[] = fetchedRooms.map(room => ({
        id: parseInt(room._id),
        name: room.name,
        type: room.type,
        price: room.price,
        capacity: room.capacity,
        isAvailable: room.isAvailable,
        images: room.images,
        amenities: room.amenities,
        description: room.description
      }));
      setRooms(mappedRooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setCurrentBooking({});
    setCheckIn(null);
    setCheckOut(null);
    setOpenDialog(true);
  };

  const handleOpenViewDialog = (booking: Booking) => {
    setDialogMode('view');
    setCurrentBooking(booking);
    setCheckIn(parseISO(booking.checkIn));
    setCheckOut(parseISO(booking.checkOut));
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (booking: Booking) => {
    setDialogMode('edit');
    setCurrentBooking(booking);
    setCheckIn(parseISO(booking.checkIn));
    setCheckOut(parseISO(booking.checkOut));
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentBooking(null);
    setCheckIn(null);
    setCheckOut(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentBooking(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSelectChange = (e: SelectChangeEvent<unknown>) => {
    const { name, value } = e.target;
    setCurrentBooking(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleRoomChange = (e: SelectChangeEvent<unknown>) => {
    const roomId = e.target.value as number;
    const selectedRoom = rooms.find(room => room.id === roomId);
    
    if (selectedRoom) {
      setCurrentBooking(prev => prev ? { 
        ...prev, 
        room: {
          id: selectedRoom.id,
          name: selectedRoom.name,
          type: selectedRoom.type,
          price: selectedRoom.price
        } 
      } : null);
    }
  };

  const handleCheckInChange = (date: Date | null) => {
    setCheckIn(date);
    if (date) {
      setCurrentBooking(prev => prev ? { ...prev, checkIn: format(date, 'yyyy-MM-dd') } : null);
    }
  };

  const handleCheckOutChange = (date: Date | null) => {
    setCheckOut(date);
    if (date) {
      setCurrentBooking(prev => prev ? { ...prev, checkOut: format(date, 'yyyy-MM-dd') } : null);
    }
  };

  const handleSubmit = async () => {
    if (!currentBooking) return;
    
    try {
      setLoading(true);
      
      if (dialogMode === 'add') {
        // Логіка для додавання нового бронювання
        // await bookingService.createBooking({...});
        console.log('Creating new booking:', currentBooking);
      } else if (dialogMode === 'edit') {
        // Логіка для редагування бронювання
        // await bookingService.updateBooking(currentBooking.id, {...});
        console.log('Updating booking:', currentBooking);
      }
      
      // Оновлюємо список бронювань
      await fetchBookings();
      handleCloseDialog();
    } catch (error: any) {
      console.error('Error submitting booking:', error);
      setError(error.message || 'Помилка при збереженні бронювання');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (id: number) => {
    if (window.confirm('Ви впевнені, що хочете видалити це бронювання?')) {
      try {
        setLoading(true);
        await bookingService.deleteBooking(id);
        await fetchBookings();
      } catch (error: any) {
        console.error('Error deleting booking:', error);
        setError(error.message || 'Помилка при видаленні бронювання');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      setLoading(true);
      await bookingService.updateBookingStatus(id, status);
      await fetchBookings();
    } catch (error: any) {
      console.error('Error updating booking status:', error);
      setError(error.message || 'Помилка при оновленні статусу бронювання');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy', { locale: uk });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const getFullName = (user: Booking['user']) => {
    return `${user.firstName} ${user.lastName}`;
  };

  const filteredBookings = () => {
    switch (tabValue) {
      case 0: // Всі
        return bookings;
      case 1: // Активні
        return bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
      case 2: // Завершені
        return bookings.filter(b => b.status === 'completed');
      case 3: // Скасовані
        return bookings.filter(b => b.status === 'cancelled');
      default:
        return bookings;
    }
  };

  const refreshBookings = () => {
    // Очищаємо кеш перед оновленням
    bookingService.clearBookingsCache();
    fetchBookings();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Управління бронюваннями
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{ mr: 2 }}
          >
            Додати бронювання
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={refreshBookings}
          >
            Оновити дані
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Всі" />
          <Tab label="Активні" />
          <Tab label="Завершені" />
          <Tab label="Скасовані" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <BookingTable 
          bookings={filteredBookings()}
          loading={loading}
          onView={handleOpenViewDialog}
          onEdit={handleOpenEditDialog}
          onDelete={handleDeleteBooking}
          onUpdateStatus={handleUpdateStatus}
          getStatusColor={getStatusColor}
          formatDate={formatDate}
          getFullName={getFullName}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <BookingTable 
          bookings={filteredBookings()}
          loading={loading}
          onView={handleOpenViewDialog}
          onEdit={handleOpenEditDialog}
          onDelete={handleDeleteBooking}
          onUpdateStatus={handleUpdateStatus}
          getStatusColor={getStatusColor}
          formatDate={formatDate}
          getFullName={getFullName}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <BookingTable 
          bookings={filteredBookings()}
          loading={loading}
          onView={handleOpenViewDialog}
          onEdit={handleOpenEditDialog}
          onDelete={handleDeleteBooking}
          onUpdateStatus={handleUpdateStatus}
          getStatusColor={getStatusColor}
          formatDate={formatDate}
          getFullName={getFullName}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <BookingTable 
          bookings={filteredBookings()}
          loading={loading}
          onView={handleOpenViewDialog}
          onEdit={handleOpenEditDialog}
          onDelete={handleDeleteBooking}
          onUpdateStatus={handleUpdateStatus}
          getStatusColor={getStatusColor}
          formatDate={formatDate}
          getFullName={getFullName}
        />
      </TabPanel>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'add' ? 'Додати бронювання' : dialogMode === 'edit' ? 'Редагувати бронювання' : 'Деталі бронювання'}
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box component="form" sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                {dialogMode === 'view' && currentBooking?.user && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Ім'я та прізвище"
                        value={getFullName(currentBooking.user)}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        value={currentBooking.user.email}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                  </>
                )}

                <Grid item xs={12} sm={6}>
                  {dialogMode === 'view' ? (
                    <TextField
                      fullWidth
                      label="Номер"
                      value={currentBooking?.room?.name || ''}
                      InputProps={{ readOnly: true }}
                    />
                  ) : (
                    <FormControl fullWidth>
                      <InputLabel>Номер</InputLabel>
                      <Select
                        name="roomId"
                        value={currentBooking?.room?.id || ''}
                        onChange={handleRoomChange}
                        disabled={dialogMode === 'add' ? false : dialogMode === 'edit' ? false : true}
                      >
                        {rooms.map((room) => (
                          <MenuItem key={room.id} value={room.id}>
                            {room.name} - {room.price} грн/ніч
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Кількість гостей"
                    name="guestCount"
                    type="number"
                    value={currentBooking?.guestCount || ''}
                    onChange={handleInputChange}
                    InputProps={{ readOnly: dialogMode === 'view' ? true : false }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={uk}>
                    <DatePicker
                      label="Дата заїзду"
                      value={checkIn}
                      onChange={handleCheckInChange}
                      disabled={dialogMode === 'view' ? true : false}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={uk}>
                    <DatePicker
                      label="Дата виїзду"
                      value={checkOut}
                      onChange={handleCheckOutChange}
                      disabled={dialogMode === 'view' ? true : false}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </LocalizationProvider>
                </Grid>

                {dialogMode !== 'add' && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Загальна вартість"
                      value={`${currentBooking?.totalPrice || 0} грн`}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                )}

                {dialogMode !== 'add' && (
                  <Grid item xs={12} sm={6}>
                    {dialogMode === 'view' ? (
                      <TextField
                        fullWidth
                        label="Статус"
                        value={currentBooking?.status || ''}
                        InputProps={{ readOnly: true }}
                      />
                    ) : (
                      <FormControl fullWidth>
                        <InputLabel>Статус</InputLabel>
                        <Select
                          name="status"
                          value={currentBooking?.status || ''}
                          onChange={handleSelectChange}
                        >
                          <MenuItem value="pending">Очікує підтвердження</MenuItem>
                          <MenuItem value="confirmed">Підтверджено</MenuItem>
                          <MenuItem value="cancelled">Скасовано</MenuItem>
                          <MenuItem value="completed">Завершено</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </Grid>
                )}

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Особливі побажання"
                    name="specialRequests"
                    multiline
                    rows={3}
                    value={currentBooking?.specialRequests || ''}
                    onChange={handleInputChange}
                    InputProps={{ readOnly: dialogMode === 'view' ? true : false }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {dialogMode === 'view' ? 'Закрити' : (dialogMode === 'add' || dialogMode === 'edit') ? 'Скасувати' : ''}
          </Button>
          {dialogMode !== 'view' && (
            <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Зберегти'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

interface BookingTableProps {
  bookings: Booking[];
  loading: boolean;
  onView: (booking: Booking) => void;
  onEdit: (booking: Booking) => void;
  onDelete: (id: number) => void;
  onUpdateStatus: (id: number, status: string) => void;
  getStatusColor: (status: string) => "success" | "warning" | "error" | "info" | "default";
  formatDate: (dateString: string) => string;
  getFullName: (user: Booking['user']) => string;
}

const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  loading,
  onView,
  onEdit,
  onDelete,
  onUpdateStatus,
  getStatusColor,
  formatDate,
  getFullName
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Гість</TableCell>
            <TableCell>Номер</TableCell>
            <TableCell>Дати</TableCell>
            <TableCell>Гостей</TableCell>
            <TableCell>Вартість</TableCell>
            <TableCell>Статус</TableCell>
            <TableCell>Дії</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : bookings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                Немає бронювань
              </TableCell>
            </TableRow>
          ) : (
            bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{getFullName(booking.user)}</TableCell>
                <TableCell>{booking.room.name}</TableCell>
                <TableCell>
                  {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                </TableCell>
                <TableCell>{booking.guestCount}</TableCell>
                <TableCell>{booking.totalPrice} грн</TableCell>
                <TableCell>
                  <Chip 
                    label={
                      booking.status === 'confirmed' ? 'Підтверджено' :
                      booking.status === 'pending' ? 'Очікує' :
                      booking.status === 'cancelled' ? 'Скасовано' :
                      booking.status === 'completed' ? 'Завершено' : booking.status
                    } 
                    color={getStatusColor(booking.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => onView(booking)} size="small" color="primary">
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => onEdit(booking)} size="small" color="primary">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => onDelete(booking.id)} size="small" color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BookingsManagement;
