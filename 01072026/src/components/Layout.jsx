import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Logout as LogoutIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  AccountCircle,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { logoutUser } from '../store/authSlice';

const drawerWidth = 240;

const Layout = ({ children, onToggleTheme, mode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const { user } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    dispatch(logoutUser());
    navigate('/login');
  };

  const menuItems = [
    { text: 'Özet Paneli', icon: <DashboardIcon sx={{ fontSize: 20 }} />, path: '/' },
    { text: 'Müşteriler', icon: <PeopleIcon sx={{ fontSize: 20 }} />, path: '/customers' },
    { text: 'Kontrol Paneli', icon: <SettingsIcon sx={{ fontSize: 20 }} />, path: '/control-panel' },
  ];

  // Mobile drawer content
  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ justifyContent: 'center', py: 2 }}>
        <Typography
          variant="h6"
          noWrap
          sx={{
            fontWeight: 900,
            background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '1px',
            cursor: 'pointer',
          }}
          onClick={() => {
            navigate('/');
            setMobileOpen(false);
          }}
        >
          MINI CRM
        </Typography>
      </Toolbar>
      <Divider sx={{ opacity: 0.6 }} />
      <List sx={{ px: 1.5, py: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  py: 1.25,
                  backgroundColor: isActive
                    ? theme.palette.mode === 'light'
                      ? 'rgba(37, 99, 235, 0.08)'
                      : 'rgba(37, 99, 235, 0.2)'
                    : 'transparent',
                  color: isActive ? 'primary.main' : 'text.primary',
                  '&:hover': {
                    backgroundColor: isActive
                      ? theme.palette.mode === 'light'
                        ? 'rgba(37, 99, 235, 0.12)'
                        : 'rgba(37, 99, 235, 0.25)'
                      : theme.palette.mode === 'light'
                      ? '#f1f5f9'
                      : '#1e293b',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'primary.main' : 'text.secondary',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.95rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider sx={{ opacity: 0.6 }} />
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textAlign: 'center' }}>
          v1.0.0 © 2026 Mini CRM
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* AppBar (Top Navigation) */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: '100%',
          backgroundColor: theme.palette.background.paper,
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 }, minHeight: 64 }}>
          {/* Logo & Navigation Tabs */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 5 } }}>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Typography
              variant="h6"
              noWrap
              onClick={() => navigate('/')}
              sx={{
                fontWeight: 900,
                background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '1px',
                cursor: 'pointer',
                mr: 2,
              }}
            >
              MINI CRM
            </Typography>

            {/* Desktop Navigation Links */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Button
                      key={item.text}
                      onClick={() => navigate(item.path)}
                      startIcon={item.icon}
                      sx={{
                        px: 2.5,
                        py: 0.75,
                        borderRadius: 2,
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        textTransform: 'none',
                        color: isActive ? 'primary.main' : 'text.secondary',
                        backgroundColor: isActive
                          ? theme.palette.mode === 'light'
                            ? 'rgba(37, 99, 235, 0.08)'
                            : 'rgba(37, 99, 235, 0.2)'
                          : 'transparent',
                        '&:hover': {
                          color: 'primary.main',
                          backgroundColor: theme.palette.mode === 'light'
                            ? 'rgba(37, 99, 235, 0.04)'
                            : 'rgba(255, 255, 255, 0.05)',
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      {item.text}
                    </Button>
                  );
                })}
              </Box>
            )}
          </Box>

          {/* Right Area: Theme Toggle & User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* Theme Toggle */}
            <IconButton onClick={onToggleTheme} color="inherit" sx={{ border: '1px solid', borderColor: 'divider', p: 1 }}>
              {mode === 'dark' ? <LightModeIcon sx={{ fontSize: 20 }} /> : <DarkModeIcon sx={{ fontSize: 20 }} />}
            </IconButton>

            {/* Profile Menu Dropdown */}
            <Box
              onClick={handleMenuOpen}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                p: 0.5,
                pr: { xs: 0.5, sm: 1.5 },
                borderRadius: 30,
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.02)',
                },
              }}
            >
              <Avatar
                src={user?.avatar || ''}
                alt={user?.fullName || 'User'}
                sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
              >
                {!user?.avatar && <AccountCircle />}
              </Avatar>
              {!isMobile && (
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {user?.fullName || 'CRM Yöneticisi'}
                </Typography>
              )}
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              slotProps={{
                paper: {
                  elevation: 3,
                  sx: {
                    mt: 1.5,
                    borderRadius: 2,
                    minWidth: 160,
                    border: '1px solid',
                    borderColor: 'divider',
                  },
                },
              }}
            >
              <MenuItem onClick={handleLogout} sx={{ gap: 1.5, py: 1.25 }}>
                <LogoutIcon fontSize="small" color="error" />
                <Typography variant="body2" color="error" sx={{ fontWeight: 600 }}>
                  Çıkış Yap
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer (Only visible on screens md and down) */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: theme.palette.background.paper,
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Main Content Container (Centered & Constrained on Ultra-wide) */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2.5, sm: 4 },
          width: '100%',
          maxWidth: 1400,
          mx: 'auto',
          mt: '64px',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
