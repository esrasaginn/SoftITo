import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/menuItems';

const initialState = {
  items: [],
  status: 'idle',
  error: null
};

export const fetchMenuByRestaurant = createAsyncThunk(
  'menu/fetchMenuByRestaurant',
  async (restaurantId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}?restaurantId=${restaurantId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addMenuItem = createAsyncThunk(
  'menu/addMenuItem',
  async (itemData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, itemData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteMenuItem = createAsyncThunk(
  'menu/deleteMenuItem',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateMenuItem = createAsyncThunk(
  'menu/updateMenuItem',
  async ({ id, price, description, name }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, { price, description, name });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    clearMenu: (state) => {
      state.items = [];
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // Menüyü Getir
      .addCase(fetchMenuByRestaurant.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMenuByRestaurant.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchMenuByRestaurant.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Yemek Ekle
      .addCase(addMenuItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Yemek Sil
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      // Yemek Güncelle
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  }
});

export const { clearMenu } = menuSlice.actions;
export default menuSlice.reducer;
