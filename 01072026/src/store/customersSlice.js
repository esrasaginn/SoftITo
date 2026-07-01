import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/customers';

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Müşteriler yüklenirken hata oluştu.');
    }
  }
);

export const addCustomer = createAsyncThunk(
  'customers/addCustomer',
  async (customerData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, {
        ...customerData,
        createdAt: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Müşteri eklenirken hata oluştu.');
    }
  }
);

export const updateCustomer = createAsyncThunk(
  'customers/updateCustomer',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Müşteri güncellenirken hata oluştu.');
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Müşteri silinirken hata oluştu.');
    }
  }
);

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  searchQuery: '',
  statusFilter: 'all', // 'all' | 'active' | 'inactive'
};

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Customers
      .addCase(fetchCustomers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Add Customer
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update Customer
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete Customer
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const { setSearchQuery, setStatusFilter } = customersSlice.actions;
export default customersSlice.reducer;
