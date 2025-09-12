// src/slices/profileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

// Get current user's profile
export const getCurrentProfile = createAsyncThunk(
  'profile/getCurrentProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      const res = await axios.get('/api/profile/me', config);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      return rejectWithValue({
        message,
        errors: err.response?.data?.errors || []
      });
    }
  }
);

// Get all profiles
export const getProfiles = createAsyncThunk(
  'profile/getProfiles',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/profile');
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      return rejectWithValue({
        message,
        errors: err.response?.data?.errors || []
      });
    }
  }
);

// Get profile by user ID
export const getProfileById = createAsyncThunk(
  'profile/getProfileById',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/profile/user/${userId}`);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      return rejectWithValue({
        message,
        errors: err.response?.data?.errors || []
      });
    }
  }
);

// Get GitHub repos
export const getGithubRepos = createAsyncThunk(
  'profile/getGithubRepos',
  async (username, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/profile/github/${username}`);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      return rejectWithValue({
        message,
        errors: err.response?.data?.errors || []
      });
    }
  }
);

// Create or update profile
export const createProfile = createAsyncThunk(
  'profile/createProfile',
  async (profileData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      };
      const res = await axios.post('/api/profile', profileData, config);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      return rejectWithValue({
        message,
        errors: err.response?.data?.errors || []
      });
    }
  }
);

// Add experience
export const addExperience = createAsyncThunk(
  'profile/addExperience',
  async (experienceData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      };
      const res = await axios.put('/api/profile/experience', experienceData, config);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      return rejectWithValue({
        message,
        errors: err.response?.data?.errors || []
      });
    }
  }
);

// Add education
export const addEducation = createAsyncThunk(
  'profile/addEducation',
  async (educationData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      };
      const res = await axios.put('/api/profile/education', educationData, config);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      return rejectWithValue({
        message,
        errors: err.response?.data?.errors || []
      });
    }
  }
);

// Delete experience
export const deleteExperience = createAsyncThunk(
  'profile/deleteExperience',
  async (expId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      const res = await axios.delete(`/api/profile/experience/${expId}`, config);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      return rejectWithValue({
        message,
        errors: err.response?.data?.errors || []
      });
    }
  }
);

// Delete education
export const deleteEducation = createAsyncThunk(
  'profile/deleteEducation',
  async (eduId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      const res = await axios.delete(`/api/profile/education/${eduId}`, config);
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      return rejectWithValue({
        message,
        errors: err.response?.data?.errors || []
      });
    }
  }
);

// Delete account & profile
export const deleteAccount = createAsyncThunk(
  'profile/deleteAccount',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      await axios.delete('/api/profile', config);
      return {};
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      return rejectWithValue({
        message,
        errors: err.response?.data?.errors || []
      });
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null,
    profiles: [],
    repos: [],
    loading: true,
    error: null
  },
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.profiles = [];
      state.repos = [];
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Current Profile
      .addCase(getCurrentProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getCurrentProfile.rejected, (state, action) => {
        state.profile = null;
        state.loading = false;
        state.error = action.payload;
      })
      // Get All Profiles
      .addCase(getProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfiles.fulfilled, (state, action) => {
        state.profiles = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getProfiles.rejected, (state, action) => {
        state.profiles = [];
        state.loading = false;
        state.error = action.payload;
      })
      // Get Profile By ID
      .addCase(getProfileById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfileById.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getProfileById.rejected, (state, action) => {
        state.profile = null;
        state.loading = false;
        state.error = action.payload;
      })
      // Get GitHub Repos
      .addCase(getGithubRepos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGithubRepos.fulfilled, (state, action) => {
        state.repos = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getGithubRepos.rejected, (state, action) => {
        state.repos = [];
        state.loading = false;
        state.error = action.payload;
      })
      // Create/Update Profile
      .addCase(createProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Experience
      .addCase(addExperience.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addExperience.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(addExperience.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Education
      .addCase(addEducation.pending, (state) => {
        state.error = null;
      })
      .addCase(addEducation.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(addEducation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Experience
      .addCase(deleteExperience.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExperience.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteExperience.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Education
      .addCase(deleteEducation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEducation.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteEducation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Account
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.profile = null;
        state.profiles = [];
        state.repos = [];
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearProfile, clearError, setLoading } = profileSlice.actions;
export default profileSlice.reducer;