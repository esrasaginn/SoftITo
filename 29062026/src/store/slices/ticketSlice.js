import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:5001';

export const fetchTrips = createAsyncThunk(
  'tickets/fetchTrips',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/trips`);
      if (!response.ok) {
        throw new Error('Seferler yüklenirken bir hata oluştu.');
      }
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchTripById = createAsyncThunk(
  'tickets/fetchTripById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/trips/${id}`);
      if (!response.ok) {
        throw new Error('Sefer detayı yüklenemedi.');
      }
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const ticketSlice = createSlice({
  name: 'tickets',
  initialState: {
    trips: [],
    filteredTrips: [],
    selectedTrip: null,
    searchParams: {
      from: '',
      to: '',
      date: '',
      type: 'bus', // 'bus' veya 'flight'
    },
    filters: {
      maxPrice: 3000,
      minPrice: 0,
      companies: [],
      sortBy: 'time', // 'time', 'price-asc', 'price-desc'
    },
    loading: false,
    error: null,
  },
  reducers: {
    setSearchParams: (state, action) => {
      state.searchParams = { ...state.searchParams, ...action.payload };
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        maxPrice: 3000,
        minPrice: 0,
        companies: [],
        sortBy: 'time',
      };
    },
    applyFilters: (state) => {
      const { from, to, date, type } = state.searchParams;
      const { maxPrice, minPrice, companies, sortBy } = state.filters;

      let result = state.trips.filter((trip) => {
        // Core travel criteria matches
        const matchesFrom = from ? trip.from.toLowerCase() === from.toLowerCase() : true;
        const matchesTo = to ? trip.to.toLowerCase() === to.toLowerCase() : true;
        const matchesDate = date ? trip.date === date : true;
        const matchesType = trip.type === type;

        // Custom filtering criteria matches
        const matchesPrice = trip.price >= minPrice && trip.price <= maxPrice;
        const matchesCompany = companies.length > 0 ? companies.includes(trip.company) : true;

        return matchesFrom && matchesTo && matchesDate && matchesType && matchesPrice && matchesCompany;
      });

      // Sorting
      if (sortBy === 'price-asc') {
        result.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-desc') {
        result.sort((a, b) => b.price - a.price);
      } else {
        // default sorting by time (HH:MM string comparison is valid since it is 24h format)
        result.sort((a, b) => a.time.localeCompare(b.time));
      }

      state.filteredTrips = result;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = action.payload;
        // Apply default routing filters
        const { from, to, date, type } = state.searchParams;
        state.filteredTrips = action.payload.filter(
          (t) => t.type === type && 
                 (!from || t.from.toLowerCase() === from.toLowerCase()) && 
                 (!to || t.to.toLowerCase() === to.toLowerCase()) &&
                 (!date || t.date === date)
        );
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTripById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedTrip = null;
      })
      .addCase(fetchTripById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTrip = action.payload;
      })
      .addCase(fetchTripById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchParams, setFilters, resetFilters, applyFilters } = ticketSlice.actions;
export default ticketSlice.reducer;
