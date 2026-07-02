import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/restaurants';

const initialState = {
  list: [],
  selectedRestaurant: null,
  status: 'idle',
  error: null
};

export const fetchRestaurants = createAsyncThunk(
  'restaurants/fetchRestaurants',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addRestaurant = createAsyncThunk(
  'restaurants/addRestaurant',
  async (restaurantData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, restaurantData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateRestaurantStatus = createAsyncThunk(
  'restaurants/updateRestaurantStatus',
  async ({ id, isActive }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, { isActive });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    } z
  }
);

export const updateRestaurantDetails = createAsyncThunk(
  'restaurants/updateRestaurantDetails',
  async ({ id, name, cuisine, image }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, { name, cuisine, image });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const restaurantSlice = createSlice({
  name: 'restaurants',
  initialState,
  reducers: {
    setSelectedRestaurant: (state, action) => {
      state.selectedRestaurant = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Restoranları Getir
      .addCase(fetchRestaurants.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Restoran Ekle
      .addCase(addRestaurant.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // Durumu Güncelle
      .addCase(updateRestaurantStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.selectedRestaurant && state.selectedRestaurant.id === action.payload.id) {
          state.selectedRestaurant = action.payload;
        }
      })
      // Detayları Güncelle
      .addCase(updateRestaurantDetails.fulfilled, (state, action) => {
        const index = state.list.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.selectedRestaurant && state.selectedRestaurant.id === action.payload.id) {
          state.selectedRestaurant = action.payload;
        }
      });
  }
});

export const { setSelectedRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;
