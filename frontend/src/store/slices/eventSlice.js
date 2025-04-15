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
            return rejectWithValue(error.response.data);
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
            return rejectWithValue(error.response.data);
        }
    }
);

export const createEvent = createAsyncThunk(
    'events/createEvent',
    async (eventData, { rejectWithValue }) => {
        try {
            const response = await api.post('/events', eventData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
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
            return rejectWithValue(error.response.data);
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
            return rejectWithValue(error.response.data);
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
            return rejectWithValue(error.response.data);
        }
    }
);

export const cancelRegistration = createAsyncThunk(
    'events/cancelRegistration',
    async (eventId, { rejectWithValue }) => {
        try {
            const response = await api.post(`/events/${eventId}/cancel-registration`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateEventResults = createAsyncThunk(
    'events/updateEventResults',
    async ({ eventId, results }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/events/${eventId}/results`, { results });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    events: [],
    currentEvent: null,
    loading: false,
    error: null
};

const eventSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentEvent: (state) => {
            state.currentEvent = null;
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
                state.error = action.payload?.message || 'Failed to fetch events';
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
                state.error = action.payload?.message || 'Failed to fetch event';
            })
            // Create Event
            .addCase(createEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.events.push(action.payload);
            })
            .addCase(createEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to create event';
            })
            // Update Event
            .addCase(updateEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEvent.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.events.findIndex(event => event._id === action.payload._id);
                if (index !== -1) {
                    state.events[index] = action.payload;
                }
                if (state.currentEvent?._id === action.payload._id) {
                    state.currentEvent = action.payload;
                }
            })
            .addCase(updateEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to update event';
            })
            // Delete Event
            .addCase(deleteEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.events = state.events.filter(event => event._id !== action.payload);
                if (state.currentEvent?._id === action.payload) {
                    state.currentEvent = null;
                }
            })
            .addCase(deleteEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to delete event';
            })
            // Register for Event
            .addCase(registerForEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerForEvent.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.events.findIndex(event => event._id === action.payload._id);
                if (index !== -1) {
                    state.events[index] = action.payload;
                }
                if (state.currentEvent?._id === action.payload._id) {
                    state.currentEvent = action.payload;
                }
            })
            .addCase(registerForEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to register for event';
            })
            // Cancel Registration
            .addCase(cancelRegistration.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelRegistration.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.events.findIndex(event => event._id === action.payload._id);
                if (index !== -1) {
                    state.events[index] = action.payload;
                }
                if (state.currentEvent?._id === action.payload._id) {
                    state.currentEvent = action.payload;
                }
            })
            .addCase(cancelRegistration.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to cancel registration';
            })
            // Update Event Results
            .addCase(updateEventResults.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEventResults.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.events.findIndex(event => event._id === action.payload._id);
                if (index !== -1) {
                    state.events[index] = action.payload;
                }
                if (state.currentEvent?._id === action.payload._id) {
                    state.currentEvent = action.payload;
                }
            })
            .addCase(updateEventResults.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to update event results';
            });
    }
});

export const { clearError, clearCurrentEvent } = eventSlice.actions;
export default eventSlice.reducer; 