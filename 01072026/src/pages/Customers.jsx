import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  Phone,
  Email,
  Business,
  Payments,
  CalendarMonth,
} from '@mui/icons-material';
import {
  fetchCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  setSearchQuery,
  setStatusFilter,
} from '../store/customersSlice';

const Customers = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Selectors
  const { items: customers, status, searchQuery, statusFilter } = useSelector(
    (state) => state.customers
  );

  // Local UI States
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  // Data Table States (Pagination & Sorting)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Changed default rows per page to 10
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');

  // Form Field States
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'active',
    budget: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch customers on load
  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  // Debounced search logic
  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setSearchQuery(localSearch));
    }, 400);

    return () => clearTimeout(handler);
  }, [localSearch, dispatch]);

  // Sync local search when redux search changes
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Reset page when filters or search terms change
  useEffect(() => {
    setPage(0);
  }, [searchQuery, statusFilter]);

  // Filter & Search computation
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sorting logic
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let aVal = a[orderBy];
    let bVal = b[orderBy];

    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination slicing
  const paginatedCustomers = sortedCustomers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleTabChange = (event, newValue) => {
    dispatch(setStatusFilter(newValue));
  };

  // Form Handling
  const handleOpenAddDialog = () => {
    setSelectedCustomer(null);
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      status: 'active',
      budget: '',
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      company: customer.company,
      email: customer.email,
      phone: customer.phone,
      status: customer.status,
      budget: customer.budget !== undefined ? customer.budget : '',
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Müşteri adı zorunludur.';
    if (!formData.company.trim()) errors.company = 'Şirket adı zorunludur.';
    if (!formData.email.trim()) {
      errors.email = 'E-posta zorunludur.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Geçerli bir e-posta adresi girin.';
    }
    if (!formData.phone.trim()) errors.phone = 'Telefon numarası zorunludur.';
    if (formData.budget === '' || isNaN(formData.budget) || Number(formData.budget) < 0) {
      errors.budget = 'Geçerli bir bütçe tutarı girin.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveCustomer = () => {
    if (!validateForm()) return;

    const payload = {
      ...formData,
      budget: Number(formData.budget),
    };

    if (selectedCustomer) {
      dispatch(
        updateCustomer({
          id: selectedCustomer.id,
          data: {
            ...selectedCustomer,
            ...payload,
          },
        })
      );
    } else {
      dispatch(addCustomer(payload));
    }
    setDialogOpen(false);
  };

  // Delete Handling
  const handleOpenDeleteDialog = (customer) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setCustomerToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (customerToDelete) {
      dispatch(deleteCustomer(customerToDelete.id));
      handleCloseDeleteDialog();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Top Section */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            Müşteriler
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Müşteri kayıtlarını yönetin, bütçeye, tarihe veya diğer kriterlere göre listeleyin.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenAddDialog}
          sx={{
            py: 1.25,
            px: 2.5,
            borderRadius: 2.5,
            background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
            boxShadow: '0 4px 15px rgba(37, 99, 235, 0.2)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1d4ed8 0%, #0f766e 100%)',
            },
          }}
        >
          Yeni Müşteri Ekle
        </Button>
      </Box>

      {/* Filter and Search Bar */}
      <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Grid container spacing={2} alignItems="center">
            {/* Search */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                placeholder="İsim, şirket, e-posta veya telefon ile ara..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2.5,
                  },
                }}
              />
            </Grid>

            {/* Filter Tabs */}
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { md: 'flex-end' } }}>
              <Tabs
                value={statusFilter}
                onChange={handleTabChange}
                textColor="primary"
                indicatorColor="primary"
                sx={{
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: '3px 3px 0 0',
                  },
                  '& .MuiTab-root': {
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    textTransform: 'none',
                    minWidth: 80,
                  },
                }}
              >
                <Tab label="Tümü" value="all" />
                <Tab label="Aktifler" value="active" />
                <Tab label="Pasifler" value="inactive" />
              </Tabs>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Main Customers List */}
      {status === 'loading' && customers.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filteredCustomers.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            py: 8,
            px: 2,
            textAlign: 'center',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
            Müşteri kaydı bulunamadı.
          </Typography>
        </Paper>
      ) : isMobile ? (
        /* Mobile Card Grid with Pagination */
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Grid container spacing={2}>
            {paginatedCustomers.map((customer) => (
              <Grid item xs={12} sm={6} key={customer.id}>
                <Card sx={{ position: 'relative', border: '1px solid', borderColor: 'divider' }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', fontWeight: 600 }}>
                          {customer.name.split(' ').map((n) => n[0]).join('')}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 700 }}>
                            #{customer.id} - {customer.name}
                          </Typography>
                          <Chip
                            label={customer.status === 'active' ? 'Aktif' : 'Pasif'}
                            color={customer.status === 'active' ? 'success' : 'error'}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              borderRadius: 1.5,
                              fontSize: '0.7rem',
                              height: 20,
                              mt: 0.5,
                            }}
                          />
                        </Box>
                      </Box>
                      <Box>
                        <IconButton size="small" onClick={() => handleOpenEditDialog(customer)} sx={{ color: 'text.secondary' }}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleOpenDeleteDialog(customer)} sx={{ color: 'error.main' }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                        <Business fontSize="small" />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {customer.company}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                        <Email fontSize="small" />
                        <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                          {customer.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                        <Phone fontSize="small" />
                        <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                          {customer.phone}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'secondary.main' }}>
                        <Payments fontSize="small" />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          Bütçe: {customer.budget ? `${Number(customer.budget).toLocaleString('tr-TR')} ₺` : '0 ₺'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                        <CalendarMonth fontSize="small" />
                        <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                          Kayıt: {new Date(customer.createdAt).toLocaleDateString('tr-TR')}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={filteredCustomers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage="Sayfa başına:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
            sx={{ borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', borderRadius: 2 }}
          />
        </Box>
      ) : (
        /* Desktop Sortable & Paginated Data Table */
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: (theme) => theme.palette.mode === 'light' ? '#f8fafc' : '#1e293b' }}>
                <TableRow>
                  {/* ID Sort Header */}
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'id'}
                      direction={orderBy === 'id' ? order : 'asc'}
                      onClick={() => handleRequestSort('id')}
                      sx={{ fontWeight: 700 }}
                    >
                      ID
                    </TableSortLabel>
                  </TableCell>
                  
                  {/* Name Sort Header */}
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'name'}
                      direction={orderBy === 'name' ? order : 'asc'}
                      onClick={() => handleRequestSort('name')}
                      sx={{ fontWeight: 700 }}
                    >
                      Müşteri
                    </TableSortLabel>
                  </TableCell>
                  
                  {/* Company Sort Header */}
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'company'}
                      direction={orderBy === 'company' ? order : 'asc'}
                      onClick={() => handleRequestSort('company')}
                      sx={{ fontWeight: 700 }}
                    >
                      Şirket
                    </TableSortLabel>
                  </TableCell>
                  
                  {/* Email/Contact Sort Header */}
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'email'}
                      direction={orderBy === 'email' ? order : 'asc'}
                      onClick={() => handleRequestSort('email')}
                      sx={{ fontWeight: 700 }}
                    >
                      İletişim
                    </TableSortLabel>
                  </TableCell>

                  {/* Budget (Büyüklük) Sort Header */}
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'budget'}
                      direction={orderBy === 'budget' ? order : 'asc'}
                      onClick={() => handleRequestSort('budget')}
                      sx={{ fontWeight: 700 }}
                    >
                      Bütçe
                    </TableSortLabel>
                  </TableCell>

                  {/* Date Sort Header */}
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'createdAt'}
                      direction={orderBy === 'createdAt' ? order : 'asc'}
                      onClick={() => handleRequestSort('createdAt')}
                      sx={{ fontWeight: 700 }}
                    >
                      Kayıt Tarihi
                    </TableSortLabel>
                  </TableCell>
                  
                  {/* Status Sort Header */}
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'status'}
                      direction={orderBy === 'status' ? order : 'asc'}
                      onClick={() => handleRequestSort('status')}
                      sx={{ fontWeight: 700 }}
                    >
                      Durum
                    </TableSortLabel>
                  </TableCell>
                  
                  <TableCell sx={{ fontWeight: 700 }} align="right">Aksiyon</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedCustomers.map((customer) => (
                  <TableRow key={customer.id} hover>
                    <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>
                      #{customer.id}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontWeight: 600 }}>
                          {customer.name.split(' ').map((n) => n[0]).join('')}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {customer.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                        {customer.company}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {customer.email}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {customer.phone}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                        {customer.budget ? `${Number(customer.budget).toLocaleString('tr-TR')} ₺` : '0 ₺'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {new Date(customer.createdAt).toLocaleDateString('tr-TR')}
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
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpenEditDialog(customer)} sx={{ mr: 1, color: 'primary.main' }}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleOpenDeleteDialog(customer)} sx={{ color: 'error.main' }}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={filteredCustomers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage="Sayfa başına satır:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
            sx={{ borderTop: '1px solid', borderColor: 'divider' }}
          />
        </Paper>
      )}

      {/* Add / Edit Customer Form Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 3, p: 1 },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          {selectedCustomer ? 'Müşteriyi Düzenle' : 'Yeni Müşteri Ekle'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
          <TextField
            name="name"
            label="Müşteri Adı Soyadı"
            fullWidth
            value={formData.name}
            onChange={handleFormChange}
            error={!!formErrors.name}
            helperText={formErrors.name}
          />
          <TextField
            name="company"
            label="Şirket Adı"
            fullWidth
            value={formData.company}
            onChange={handleFormChange}
            error={!!formErrors.company}
            helperText={formErrors.company}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="E-posta Adresi"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleFormChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="phone"
                label="Telefon Numarası"
                fullWidth
                value={formData.phone}
                onChange={handleFormChange}
                error={!!formErrors.phone}
                helperText={formErrors.phone}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="budget"
                label="Bütçe (TL)"
                type="number"
                fullWidth
                value={formData.budget}
                onChange={handleFormChange}
                error={!!formErrors.budget}
                helperText={formErrors.budget}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Müşteri Durumu</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  label="Müşteri Durumu"
                  value={formData.status}
                  onChange={handleFormChange}
                >
                  <MenuItem value="active">Aktif</MenuItem>
                  <MenuItem value="inactive">Pasif</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={handleCloseDialog} color="inherit" sx={{ fontWeight: 600 }}>
            İptal
          </Button>
          <Button
            onClick={handleSaveCustomer}
            variant="contained"
            sx={{
              fontWeight: 700,
              px: 3,
              background: 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1d4ed8 0%, #0f766e 100%)',
              },
            }}
          >
            {selectedCustomer ? 'Güncelle' : 'Kaydet'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        slotProps={{
          paper: {
            sx: { borderRadius: 3 },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Müşteriyi Sil</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            <strong>{customerToDelete?.name}</strong> isimli müşteriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDeleteDialog} color="inherit" sx={{ fontWeight: 600 }}>
            Vazgeç
          </Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error" sx={{ fontWeight: 700 }}>
            Evet, Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Customers;
