import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTrips } from './ticketSlice';

const API_URL = 'http://localhost:5001';

export const completeBooking = createAsyncThunk(
  'booking/completeBooking',
  async ({ trip, selectedSeats, passengerDetails, user }, { dispatch, rejectWithValue }) => {
    try {
      // 1. Prepare updated seats array for the trip
      const updatedSeats = trip.seats.map((seat) => {
        if (selectedSeats.includes(seat.number)) {
          return { ...seat, isOccupied: true };
        }
        return seat;
      });

      // 2. Update the trip resource on the server
      const tripUpdateResponse = await fetch(`${API_URL}/trips/${trip.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ seats: updatedSeats }),
      });

      if (!tripUpdateResponse.ok) {
        throw new Error('Koltuk rezervasyonu güncellenirken hata oluştu.');
      }

      // 3. Create the booking record
      const bookingData = {
        userId: user ? user.id : 'guest',
        userEmail: user ? user.email : passengerDetails.email,
        userName: user ? user.name : passengerDetails.name,
        tripId: trip.id,
        tripDetails: {
          from: trip.from,
          to: trip.to,
          date: trip.date,
          time: trip.time,
          type: trip.type,
          company: trip.company,
        },
        selectedSeats,
        totalPrice: trip.price * selectedSeats.length,
        passengerDetails,
        bookingDate: new Date().toISOString(),
        paymentStatus: 'success',
      };

      const bookingResponse = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!bookingResponse.ok) {
        throw new Error('Rezervasyon kaydı oluşturulamadı.');
      }

      const bookingResult = await bookingResponse.json();

      // Refresh the trips list in the store so UI is updated with occupied seats
      await dispatch(fetchTrips());

      return bookingResult;
    } catch (err) {
      return rejectWithValue(err.message || 'Ödeme ve rezervasyon kaydı başarısız oldu.');
    }
  }
);

export const fetchUserBookings = createAsyncThunk(
  'booking/fetchUserBookings',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/bookings?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Rezervasyonlarınız yüklenemedi.');
      }
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    bookings: [],
    loading: false,
    error: null,
    currentBooking: null,
  },
  reducers: {
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(completeBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
        state.bookings.push(action.payload);
      })
      .addCase(completeBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
