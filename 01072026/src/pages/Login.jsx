import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Person,
  Lock,
  Visibility,
  VisibilityOff,
  AutoGraph,
} from '@mui/icons-material';
import { loginUser } from '../store/authSlice';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, status, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    dispatch(loginUser({ username, password }));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        position: 'relative',
        overflow: 'hidden',
        px: 2,
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, rgba(37,99,235,0) 70%)',
          top: '10%',
          left: '15%',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(13,148,136,0.12) 0%, rgba(13,148,136,0) 70%)',
          bottom: '10%',
          right: '15%',
          pointerEvents: 'none',
        },
      }}
    >
      <Card
        sx={{
          maxWidth: 420,
          width: '100%',
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          borderRadius: 4,
          color: '#f8fafc',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Logo / Header */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(37, 99, 235, 0.3)',
                mb: 2,
              }}
            >
              <AutoGraph sx={{ color: '#ffffff', fontSize: 32 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '0.5px', mb: 0.5 }}>
              Mini CRM
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Müşteri İlişkileri Yönetimi Portalı
            </Typography>
          </Box>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    borderRadius: 2,
                    background: 'rgba(244, 63, 94, 0.1)',
                    border: '1px solid rgba(244, 63, 94, 0.2)',
                    color: '#f43f5e',
                    '& .MuiAlert-icon': { color: '#f43f5e' },
                  }}
                >
                  {error}
                </Alert>
              )}

              <TextField
                label="Kullanıcı Adı"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={status === 'loading'}
                autoComplete="username"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: '#64748b' }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#f8fafc',
                    backgroundColor: 'rgba(15, 23, 42, 0.3)',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&.Mui-focused fieldset': { borderColor: '#2563eb' },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#64748b',
                    '&.Mui-focused': { color: '#2563eb' },
                  },
                }}
              />

              <TextField
                label="Şifre"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={status === 'loading'}
                autoComplete="current-password"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#64748b' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: '#64748b' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#f8fafc',
                    backgroundColor: 'rgba(15, 23, 42, 0.3)',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                    '&.Mui-focused fieldset': { borderColor: '#2563eb' },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#64748b',
                    '&.Mui-focused': { color: '#2563eb' },
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={status === 'loading'}
                sx={{
                  py: 1.5,
                  borderRadius: 2.5,
                  background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  letterSpacing: '0.5px',
                  boxShadow: '0 4px 20px rgba(37, 99, 235, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1d4ed8 0%, #0f766e 100%)',
                    boxShadow: '0 6px 24px rgba(37, 99, 235, 0.4)',
                  },
                }}
              >
                {status === 'loading' ? (
                  <CircularProgress size={24} sx={{ color: '#ffffff' }} />
                ) : (
                  'Giriş Yap'
                )}
              </Button>
            </Box>
          </form>

          {/* Demo Credentials Hint */}
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Demo Giriş Bilgileri: <strong style={{ color: '#94a3b8' }}>admin</strong> / <strong style={{ color: '#94a3b8' }}>password123</strong>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
