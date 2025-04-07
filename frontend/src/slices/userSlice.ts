import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import userService, { User } from '../services/userService';

interface UserState {
  users: User[];
  user: User | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: UserState = {
  users: [],
  user: null,
  loading: false,
  error: null,
  success: false,
};

// Async thunks
export const getAllUsers = createAsyncThunk(
  'users/getAll',
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getAllUsers();
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch users';
      return rejectWithValue(message);
    }
  }
);

export const getUserById = createAsyncThunk(
  'users/getById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await userService.getUserById(id);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch user details';
      return rejectWithValue(message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await userService.deleteUser(id);
      return { id };
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to delete user';
      return rejectWithValue(message);
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'users/updateRole',
  async ({ id, isAdmin }: { id: string; isAdmin: boolean }, { rejectWithValue }) => {
    try {
      return await userService.updateUserRole(id, isAdmin);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to update user role';
      return rejectWithValue(message);
    }
  }
);

// Slice
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all users
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get user by ID
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.loading = false;
        state.success = true;
        state.users = state.users.filter((user) => user._id !== action.payload.id);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update user role
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.success = true;
        state.users = state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        );
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetSuccess, clearError } = userSlice.actions;
export default userSlice.reducer; 