import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { authService } from '../services';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Додаємо логування при завантаженні компонента
  useEffect(() => {
    console.log('LoginPage mounted');
    
    // Перевіряємо, чи користувач вже авторизований
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    console.log('Is token in localStorage:', token ? 'yes' : 'no');
    console.log('User data in localStorage:', userStr);
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log('User is already authenticated, user data:', user);
        
        if (user.role === 'admin') {
          console.log('User is admin, redirecting to admin dashboard...');
          navigate('/admin');
        } else {
          console.log('User is not admin, redirecting to home page...');
          navigate('/');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Якщо дані пошкоджені, видаляємо їх
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валідація форми
    if (!email || !password) {
      setError('Будь ласка, заповніть всі поля');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('Attempting login with:', { email });
      
      // Спроба входу через API
      let userData;
      
      try {
        userData = await authService.login({ email, password });
        console.log('Login successful, received data:', userData);
      } catch (apiError) {
        console.error('API login failed, trying mock data:', apiError);
        
        // Якщо API недоступне, перевіряємо тестові дані
        if (email === 'admin@marialux.com' && password === 'admin123') {
          console.log('Using mock data for admin login');
          userData = {
            token: 'mock-jwt-token-for-admin',
            user: {
              id: 1,
              firstName: 'Адміністратор',
              lastName: 'Системи',
              email: 'admin@marialux.com',
              role: 'admin'
            }
          };
        } else if (email === 'user@example.com' && password === 'user123') {
          console.log('Using mock data for user login');
          userData = {
            token: 'mock-jwt-token-for-user',
            user: {
              id: 2,
              firstName: 'Іван',
              lastName: 'Петренко',
              email: 'user@example.com',
              role: 'user'
            }
          };
        } else {
          throw apiError;
        }
      }
      
      if (!userData) {
        throw new Error('Не вдалося отримати дані користувача');
      }
      
      // Зберігаємо токен та інформацію про користувача
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData.user));
      
      console.log('Token and user data saved to localStorage');
      console.log('User role:', userData.user.role);
      
      // Перенаправляємо на головну сторінку або панель адміністратора
      if (userData.user.role === 'admin') {
        console.log('Redirecting to admin dashboard...');
        navigate('/admin');
      } else {
        console.log('Redirecting to home page...');
        navigate('/');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Помилка при вході. Перевірте логін та пароль.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Вхід до облікового запису
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Пароль"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Увійти'}
            </Button>
            
            <Grid container>
              <Grid item xs>
                <Link to="/forgot-password">
                  <Typography variant="body2" color="primary">
                    Забули пароль?
                  </Typography>
                </Link>
              </Grid>
              <Grid item>
                <Link to="/register">
                  <Typography variant="body2" color="primary">
                    Немає облікового запису? Зареєструватися
                  </Typography>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
