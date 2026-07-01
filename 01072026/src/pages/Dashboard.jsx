import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  LinearProgress,
  CircularProgress,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  PeopleAlt,
  ToggleOn,
  ToggleOff,
  ChevronRight,
  TrendingUp,
} from '@mui/icons-material';
import { fetchCustomers } from '../store/customersSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { items: customers, status } = useSelector((state) => state.customers);
  const { user } = useSelector((state) => state.auth);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const totalCount = customers.length;
  const activeCount = customers.filter((c) => c.status === 'active').length;
  const inactiveCount = customers.filter((c) => c.status === 'inactive').length;

  const activePercent = totalCount ? Math.round((activeCount / totalCount) * 100) : 0;
  const inactivePercent = totalCount ? Math.round((inactiveCount / totalCount) * 100) : 0;

  // Get all customers sorted by creation date
  const allCustomersList = [...customers]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Group data by last 6 months for the Area Chart
  const getMonthlyTrendData = () => {
    const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
    const now = new Date();
    const data = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthIndex = d.getMonth();
      const year = d.getFullYear();
      const monthLabel = `${months[monthIndex]} ${year.toString().slice(-2)}`;
      
      const realCount = customers.filter((c) => {
        const cDate = new Date(c.createdAt);
        return cDate.getMonth() === monthIndex && cDate.getFullYear() === year;
      }).length;

      data.push({ label: monthLabel, count: realCount });
    }
    return data;
  };

  // Group data by Company for the Bar Chart
  const getCompanyDistribution = () => {
    const dist = {};
    customers.forEach((c) => {
      dist[c.company] = (dist[c.company] || 0) + 1;
    });

    return Object.entries(dist)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  if (status === 'loading' && customers.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  // Stat Cards Configuration
  const statCards = [
    {
      title: 'Toplam Müşteri',
      value: totalCount,
      icon: <PeopleAlt sx={{ fontSize: 36, color: '#2563eb' }} />,
      bg: 'rgba(37, 99, 235, 0.04)',
      borderColor: 'rgba(37, 99, 235, 0.12)',
    },
    {
      title: 'Aktif Müşteri',
      value: activeCount,
      icon: <ToggleOn sx={{ fontSize: 36, color: '#0d9488' }} />,
      bg: 'rgba(13, 148, 136, 0.04)',
      borderColor: 'rgba(13, 148, 136, 0.12)',
    },
    {
      title: 'Pasif Müşteri',
      value: inactiveCount,
      icon: <ToggleOff sx={{ fontSize: 36, color: '#f43f5e' }} />,
      bg: 'rgba(244, 63, 94, 0.04)',
      borderColor: 'rgba(244, 63, 94, 0.12)',
    },
  ];

  // SVG Area Chart Math
  const trendData = getMonthlyTrendData();
  const maxVal = Math.max(...trendData.map(d => d.count), 6);
  const chartPoints = trendData.map((d, index) => {
    const x = 50 + index * 80;
    const y = 160 - (d.count / maxVal) * 110;
    return { ...d, x, y };
  });

  const areaPath = chartPoints.reduce((acc, p, index) => {
    return acc + `${index === 0 ? 'M' : 'L'} ${p.x} ${p.y} `;
  }, '') + `L ${chartPoints[chartPoints.length - 1].x} 160 L ${chartPoints[0].x} 160 Z`;

  const linePath = chartPoints.reduce((acc, p, index) => {
    return acc + `${index === 0 ? 'M' : 'L'} ${p.x} ${p.y} `;
  }, '');

  // SVG Donut Chart Math
  const circumference = 314.16;
  const activeStroke = (activePercent / 100) * circumference;
  const inactiveStroke = (inactivePercent / 100) * circumference;
  const activeAngle = -90;
  const inactiveAngle = -90 + (activePercent / 100) * 360;

  // SVG Horizontal Bar Chart Math
  const companyData = getCompanyDistribution();
  const maxCompanyVal = Math.max(...companyData.map(d => d.count), 1);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Minimalist Welcome Header */}
      <Box
        sx={{
          p: { xs: 2.5, sm: 3 },
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
            <Box
              sx={{
                width: 7,
                height: 7,
                bgcolor: '#10b981',
                borderRadius: '50%',
              }}
            />
            <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, color: 'text.secondary', fontSize: '0.7rem' }}>
              CRM Aktif • {totalCount} Kayıt
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', fontSize: { xs: '1.5rem', sm: '1.85rem' } }}>
            Hoş Geldiniz, {user?.fullName || 'Esra Sağın'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, maxW: '600px' }}>
            Panel üzerinden müşteri sayılarını, proje bütçelerini ve aylık kayıt trendlerini takip edebilirsiniz.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Paper
            variant="outlined"
            sx={{
              px: 2,
              py: 1,
              borderRadius: 2,
              bgcolor: 'background.default',
              borderColor: 'divider',
              textAlign: 'center',
            }}
          >
            <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, color: 'text.secondary', fontSize: '0.65rem', textTransform: 'uppercase' }}>
              Bugün
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={4} key={card.title}>
            <Card
              sx={{
                height: '100%',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: card.borderColor,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.04)',
                },
              }}
            >
              <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 1 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    {card.value}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    bgcolor: card.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {card.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Grid (Area Chart & Donut Chart) */}
      <Grid container spacing={4}>
        {/* Registration Trend Area Chart */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3, position: 'relative' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Müşteri Kayıt Trendi (Son 6 Ay)
              </Typography>

              {/* Area Chart SVG */}
              <Box sx={{ width: '100%', height: 220, position: 'relative', mt: 2 }}>
                <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="45" y1="50" x2="460" y2="50" stroke={theme.palette.divider} strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="45" y1="105" x2="460" y2="105" stroke={theme.palette.divider} strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="45" y1="160" x2="460" y2="160" stroke={theme.palette.divider} strokeWidth="1.5" />

                  {/* Area */}
                  <path d={areaPath} fill="url(#areaGrad)" />
                  
                  {/* Line */}
                  <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />

                  {/* Dots & Interactions */}
                  {chartPoints.map((p, index) => (
                    <g key={index}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={hoveredPoint?.index === index ? 7 : 5}
                        fill={theme.palette.background.paper}
                        stroke="#2563eb"
                        strokeWidth="3"
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease-in-out' }}
                        onMouseEnter={() => setHoveredPoint({ ...p, index })}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    </g>
                  ))}

                  {/* X Axis Labels */}
                  {chartPoints.map((p, index) => (
                    <text
                      key={index}
                      x={p.x}
                      y="180"
                      textAnchor="middle"
                      fill={theme.palette.text.secondary}
                      style={{ fontSize: '10px', fontWeight: 600, fontFamily: 'inherit' }}
                    >
                      {p.label}
                    </text>
                  ))}
                </svg>

                {/* Custom Tooltip */}
                {hoveredPoint && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: `${(hoveredPoint.x / 500) * 100}%`,
                      top: `${(hoveredPoint.y / 200) * 100 - 25}%`,
                      transform: 'translate(-50%, -100%)',
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      borderRadius: 2,
                      px: 1.5,
                      py: 0.75,
                      pointerEvents: 'none',
                      zIndex: 10,
                      animation: 'fadeIn 0.2s ease-out',
                      '@keyframes fadeIn': {
                        from: { opacity: 0, transform: 'translate(-50%, -90%)' },
                        to: { opacity: 1, transform: 'translate(-50%, -100%)' }
                      }
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', color: 'text.secondary' }}>
                      {hoveredPoint.label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>
                      {hoveredPoint.count} Müşteri
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Donut Chart */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, width: '100%', textAlign: 'left' }}>
                Müşteri Durum Dağılımı
              </Typography>

              {totalCount === 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Veri bulunmuyor.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, width: '100%' }}>
                  {/* SVG Donut Chart */}
                  <Box sx={{ position: 'relative', width: 140, height: 140 }}>
                    <svg width="100%" height="100%" viewBox="0 0 120 120">
                      {/* Background track */}
                      <circle cx="60" cy="60" r="50" fill="transparent" stroke={theme.palette.mode === 'light' ? '#f1f5f9' : '#1e293b'} strokeWidth="12" />
                      
                      {/* Active circle */}
                      {activePercent > 0 && (
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          fill="transparent"
                          stroke="#0d9488"
                          strokeWidth="12"
                          strokeDasharray="314.16"
                          strokeDashoffset={314.16 - activeStroke}
                          transform={`rotate(${activeAngle} 60 60)`}
                          strokeLinecap="round"
                          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                        />
                      )}

                      {/* Inactive circle */}
                      {inactivePercent > 0 && (
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          fill="transparent"
                          stroke="#f43f5e"
                          strokeWidth="12"
                          strokeDasharray="314.16"
                          strokeDashoffset={314.16 - inactiveStroke}
                          transform={`rotate(${inactiveAngle} 60 60)`}
                          strokeLinecap="round"
                          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                        />
                      )}

                      {/* Center texts */}
                      <text x="60" y="58" textAnchor="middle" fill={theme.palette.text.primary} style={{ fontSize: '15px', fontWeight: 800, fontFamily: 'inherit' }}>
                        {totalCount}
                      </text>
                      <text x="60" y="74" textAnchor="middle" fill={theme.palette.text.secondary} style={{ opacity: 0.7, fontSize: '8px', fontWeight: 700, letterSpacing: '0.5px', fontFamily: 'inherit' }}>
                        MÜŞTERİ
                      </text>
                    </svg>
                  </Box>

                  {/* Legend Labels */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#0d9488' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Aktif (%{activePercent})
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f43f5e' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Pasif (%{inactivePercent})
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Recent Customers Table */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Kayıtlı Müşteriler Listesi
                </Typography>
                <Button
                  variant="text"
                  endIcon={<ChevronRight />}
                  onClick={() => navigate('/customers')}
                  sx={{ fontWeight: 700 }}
                >
                  Müşterileri Yönet
                </Button>
              </Box>

              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  maxHeight: 320,
                  overflowY: 'auto',
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, bgcolor: (theme) => theme.palette.mode === 'light' ? '#f8fafc' : '#1e293b' }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: (theme) => theme.palette.mode === 'light' ? '#f8fafc' : '#1e293b' }}>Müşteri</TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: (theme) => theme.palette.mode === 'light' ? '#f8fafc' : '#1e293b' }}>Şirket</TableCell>
                      <TableCell sx={{ fontWeight: 600, bgcolor: (theme) => theme.palette.mode === 'light' ? '#f8fafc' : '#1e293b' }}>Durum</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allCustomersList.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                          Henüz kayıtlı müşteri yok.
                        </TableCell>
                      </TableRow>
                    ) : (
                      allCustomersList.map((customer) => (
                        <TableRow key={customer.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>
                            #{customer.id}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem', fontWeight: 600 }}>
                                {customer.name.split(' ').map(n => n[0]).join('')}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {customer.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                  {customer.email}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                              {customer.company}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={customer.status === 'active' ? 'Aktif' : 'Pasif'}
                              color={customer.status === 'active' ? 'success' : 'error'}
                              size="small"
                              sx={{
                                fontWeight: 700,
                                borderRadius: 1.5,
                                fontSize: '0.75rem',
                                height: 24,
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Company Distribution Bar Chart */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Şirket Bazlı Dağılım (Top 5)
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, mt: 2 }}>
                {companyData.map((item, index) => {
                  const widthPercent = Math.max(Math.round((item.count / maxCompanyVal) * 100), 10);
                  return (
                    <Box key={index}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          {item.count} Müşteri
                        </Typography>
                      </Box>
                      {/* Animated Rounded Bar */}
                      <Box sx={{ width: '100%', height: 10, bgcolor: theme.palette.mode === 'light' ? '#f1f5f9' : '#1e293b', borderRadius: 5, overflow: 'hidden' }}>
                        <Box
                          sx={{
                            width: `${widthPercent}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #2563eb 0%, #0d9488 100%)',
                            borderRadius: 5,
                            transition: 'width 1s ease-in-out',
                          }}
                        />
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
