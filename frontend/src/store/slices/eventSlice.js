import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const getEvents = createAsyncThunk(
    'events/getEvents',
    async (filters, { rejectWithValue }) => {
        try {
            const response = await api.get('/events', { params: filters });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
        }
    }
);

export const getEventById = createAsyncThunk(
    'events/getEventById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/events/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch event');
        }
    }
);

export const createEvent = createAsyncThunk(
    'events/createEvent',
    async (eventData, { rejectWithValue }) => {
        try {
            const response = await api.post('/events', eventData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error in createEvent:', error);
            return rejectWithValue(error.response?.data?.message || 'Failed to create event');
        }
    }
);

export const updateEvent = createAsyncThunk(
    'events/updateEvent',
    async ({ id, eventData }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/events/${id}`, eventData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update event');
        }
    }
);

export const deleteEvent = createAsyncThunk(
    'events/deleteEvent',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/events/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete event');
        }
    }
);

export const registerForEvent = createAsyncThunk(
    'events/registerForEvent',
    async (eventId, { rejectWithValue }) => {
        try {
            const response = await api.post(`/events/${eventId}/register`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to register for event');
        }
    }
);

export const cancelRegistration = createAsyncThunk(
    'events/cancelRegistration',
    async (eventId, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/events/${eventId}/register`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to cancel registration');
        }
    }
);

export const updateEventResults = createAsyncThunk(
    'events/updateEventResults',
    async ({ eventId, results }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/events/${eventId}/results`, { results });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update results');
        }
    }
);

const initialState = {
    events: [],
    currentEvent: null,
    loading: false,
    error: null,
    success: false,
};

const eventSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Events
            .addCase(getEvents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload;
            })
            .addCase(getEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Event by ID
            .addCase(getEventById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getEventById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentEvent = action.payload;
            })
            .addCase(getEventById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Event
            .addCase(createEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.events.unshift(action.payload);
                state.success = true;
            })
            .addCase(createEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })
            // Update Event
            .addCase(updateEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.events = state.events.map((event) =>
                    event._id === action.payload._id ? action.payload : event
                );
                state.currentEvent = action.payload;
                state.success = true;
            })
            .addCase(updateEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })
            // Delete Event
            .addCase(deleteEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.events = state.events.filter((event) => event._id !== action.payload);
            })
            .addCase(deleteEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Register for Event
            .addCase(registerForEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerForEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.currentEvent = action.payload;
                state.events = state.events.map((event) =>
                    event._id === action.payload._id ? action.payload : event
                );
            })
            .addCase(registerForEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Cancel Registration
            .addCase(cancelRegistration.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelRegistration.fulfilled, (state, action) => {
                state.loading = false;
                state.currentEvent = action.payload;
                state.events = state.events.map((event) =>
                    event._id === action.payload._id ? action.payload : event
                );
            })
            .addCase(cancelRegistration.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Event Results
            .addCase(updateEventResults.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEventResults.fulfilled, (state, action) => {
                state.loading = false;
                state.currentEvent = action.payload;
                state.events = state.events.map((event) =>
                    event._id === action.payload._id ? action.payload : event
                );
            })
            .addCase(updateEventResults.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, clearSuccess } = eventSlice.actions;
export default eventSlice.reducer;