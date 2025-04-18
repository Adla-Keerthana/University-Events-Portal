import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/register', userData);
            const { token, ...user } = response.data;
            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Registration failed' });
        }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', credentials);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await api.post('/auth/logout');
            return null;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getProfile = createAsyncThunk(
    'auth/getProfile',
    async (_, { rejectWithValue, getState }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return rejectWithValue({ message: 'No token found' });
            }

            // Check if we're already loading
            const { loading } = getState().auth;
            if (loading) {
                return rejectWithValue({ message: 'Profile fetch already in progress' });
            }

            const response = await api.get('/auth/profile');
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
            return rejectWithValue(error.response?.data || { message: 'Failed to get profile' });
        }
    }
);

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (profileData, { rejectWithValue }) => {
        try {
            const response = await api.put('/auth/profile', profileData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const verifyEmail = createAsyncThunk(
    'auth/verifyEmail',
    async (token, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/verify-email', { token });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/forgot-password', { email });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ token, password }, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/reset-password', { token, password });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
};

// Initialize state from localStorage if available
const storedUser = localStorage.getItem('user');
const storedToken = localStorage.getItem('token');

if (storedUser && storedToken) {
    try {
        initialState.user = JSON.parse(storedUser);
        initialState.token = storedToken;
        initialState.isAuthenticated = true;
    } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear invalid data from localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Registration failed';
            })
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Login failed';
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            })
            // Get Profile
            .addCase(getProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to get profile';
            })
            // Update Profile
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to update profile';
            });
    }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;