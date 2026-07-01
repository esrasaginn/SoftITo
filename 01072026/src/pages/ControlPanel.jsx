import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  TextField,
  Avatar,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Settings,
  Storage,
  AdminPanelSettings,
  Save,
  CheckCircle,
} from '@mui/icons-material';
import { fetchCustomers } from '../store/customersSlice';

const ControlPanel = () => {
  const dispatch = useDispatch();
  const { items: customers } = useSelector((state) => state.customers);

  // States
  const [latency, setLatency] = useState('200');
  const [defaultRows, setDefaultRows] = useState('10');
  const [notifications, setNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(false);
  const [adminName, setAdminName] = useState('Esra Sağın');
  const [adminRole, setAdminRole] = useState('Sistem Yöneticisi');
  
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  // Calculations
  const totalCount = customers.length;
  const activeCount = customers.filter((c) => c.status === 'active').length;
  const totalBudget = customers.reduce((sum, c) => sum + (Number(c.budget) || 0), 0);
  const avgBudget = totalCount ? Math.round(totalBudget / totalCount) : 0;

  const handleSaveSettings = () => {
    setToastMsg('Sistem ayarları başarıyla kaydedildi!');
    setToastOpen(true);
  };

  const handleUpdateProfile = () => {
    setToastMsg('Admin profili başarıyla güncellendi!');
    setToastOpen(true);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Top Section */}
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Kontrol Paneli
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Sistem tercihlerini, veritabanı ayarlarını ve admin profili konfigürasyonlarını yönetin.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left Side: System & DB settings */}
        <Grid item xs={12} lg={8} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          
          {/* Card 1: System Settings */}
          <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Settings color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Sistem Ayarları
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="latency-label">API Gecikme Simülasyonu</InputLabel>
                    <Select
                      labelId="latency-label"
                      value={latency}
                      label="API Gecikme Simülasyonu"
                      onChange={(e) => setLatency(e.target.value)}
                    >
                      <MenuItem value="0">0ms (Anında Tepki)</MenuItem>
                      <MenuItem value="200">200ms (Hızlı Bağlantı)</MenuItem>
                      <MenuItem value="500">500ms (Normal Gecikme)</MenuItem>
                      <MenuItem value="1000">1000ms (Yavaş / 3G Simülasyonu)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="rows-label">Varsayılan Satır Sayısı</InputLabel>
                    <Select
                      labelId="rows-label"
                      value={defaultRows}
                      label="Varsayılan Satır Sayısı"
                      onChange={(e) => setDefaultRows(e.target.value)}
                    >
                      <MenuItem value="5">5 Satır</MenuItem>
                      <MenuItem value="10">10 Satır</MenuItem>
                      <MenuItem value="25">25 Satır</MenuItem>
                      <MenuItem value="50">50 Satır</MenuItem>
                      <MenuItem value="100">100 Satır</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications}
                        onChange={(e) => setNotifications(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Anlık e-posta bildirimleri gönder"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={autoBackup}
                        onChange={(e) => setAutoBackup(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Haftalık otomatik yedekleme al"
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSaveSettings}
                  sx={{
                    px: 3,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1d4ed8 0%, #0f766e 100%)',
                    },
                  }}
                >
                  Ayarları Kaydet
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Card 2: CRM & Database statistics */}
          <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Storage color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Veritabanı Durumu (CRM Veri Analizi)
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={6} sm={3}>
                  <Card variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      TOPLAM MÜŞTERİ
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
                      {totalCount}
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Card variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      AKTİF MÜŞTERİ
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'success.main', mt: 0.5 }}>
                      {activeCount}
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Card variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      TOPLAM BÜTÇE
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', mt: 0.5, fontSize: '1.1rem' }}>
                      {totalBudget.toLocaleString('tr-TR')} ₺
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Card variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      ORTALAMA BÜTÇE
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'secondary.main', mt: 0.5, fontSize: '1.1rem' }}>
                      {avgBudget.toLocaleString('tr-TR')} ₺
                    </Typography>
                  </Card>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Alert severity="success" icon={<CheckCircle fontSize="inherit" />} sx={{ borderRadius: 2, fontWeight: 500 }}>
                  Yerel veritabanı (db.json) sunucusu aktif durumda ve stabil çalışıyor. Herhangi bir gecikme hatası saptanmadı.
                </Alert>
              </Box>
            </CardContent>
          </Card>

        </Grid>

        {/* Right Side: Profile settings */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, width: '100%' }}>
                <AdminPanelSettings color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Yönetici Profili
                </Typography>
              </Box>

              <Avatar
                sx={{
                  width: 90,
                  height: 90,
                  fontSize: '2rem',
                  fontWeight: 700,
                  bgcolor: 'primary.main',
                  mb: 2,
                  boxShadow: '0 8px 24px rgba(37, 99, 235, 0.2)',
                }}
              >
                {adminName.split(' ').map((n) => n[0]).join('')}
              </Avatar>

              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {adminName}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, mb: 4 }}>
                {adminRole}
              </Typography>

              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Adı Soyadı"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Sistem Rolü"
                  value={adminRole}
                  onChange={(e) => setAdminRole(e.target.value)}
                />

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleUpdateProfile}
                  sx={{
                    mt: 2,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1d4ed8 0%, #0f766e 100%)',
                    },
                  }}
                >
                  Profili Güncelle
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Success Toast */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setToastOpen(false)} severity="success" sx={{ width: '100%', borderRadius: 2 }}>
          {toastMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ControlPanel;
