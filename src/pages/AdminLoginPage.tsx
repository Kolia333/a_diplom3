import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@marialux.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      
      console.log('Attempting admin login with:', { email });
      
      // Перевірка адміністратора
      if (email === 'admin@marialux.com' && password === 'admin123') {
        console.log('Admin login successful');
        
        // Створюємо дані адміністратора
        const adminData = {
          id: 1,
          firstName: 'Адміністратор',
          lastName: 'Системи',
          email: 'admin@marialux.com',
          role: 'admin'
        };
        
        // Зберігаємо токен та інформацію про адміністратора
        localStorage.setItem('adminToken', 'admin-jwt-token');
        localStorage.setItem('adminUser', JSON.stringify(adminData));
        
        console.log('Admin token and user data saved to localStorage');
        
        // Перенаправляємо на панель адміністратора
        console.log('Redirecting to admin dashboard...');
        setTimeout(() => {
          navigate('/admin-panel');
        }, 500);
      } else {
        setError('Невірний email або пароль адміністратора');
      }
    } catch (err: any) {
      console.error('Admin login error:', err);
      setError('Помилка при вході. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Вхід для адміністратора
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
              label="Email адміністратора"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || true} // Поле email заблоковане
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Пароль адміністратора"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoFocus
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
              {loading ? <CircularProgress size={24} /> : 'Увійти як адміністратор'}
            </Button>
            
            <Grid container>
              <Grid item>
                <Link to="/login">
                  <Typography variant="body2" color="primary">
                    Повернутися до звичайного входу
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

export default AdminLoginPage;
