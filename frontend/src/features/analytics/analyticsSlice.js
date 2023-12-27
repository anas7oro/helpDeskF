
import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import analyticsService from './analyticsService'



const initialState = {
  analytics: [],
  analyticsCharts: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: ''
};

export const getAnalytics = createAsyncThunk('analytics/getAnalytics', async (form, thunkAPI) => {
  try {
    const data = await analyticsService.getAnalytics(form);
    return thunkAPI.fulfillWithValue(data);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const getAgentAnalytics = createAsyncThunk('analytics/getAgentAnalytics', async ( thunkAPI) => {
  try {
    console.log(" trying to get agent analytics from slice");
    const data = await analyticsService.getAgentAnalytics();
    console.log(" Agent analytics from slice: ", data);
    return data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});
export const getAnalyticsCharts = createAsyncThunk('analytics/getAnalyticsCharts', async ( thunkAPI) => {
  try {
    console.log(" trying to get analytics charts from slice");
    const data = await analyticsService.getAnalyticsCharts();
    console.log(" Analytics charts from slice: ", data);
    return data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

const AgentAnalyticsSlice = createSlice({
  name: 'analytics',
  initialState: { agentAnalytics: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAgentAnalytics.fulfilled, (state, action) => {
      state.agentAnalytics = action.payload;
    });
  },
});

export const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.isSuccess = false
      state.message = ''
    }
  },
  extraReducers: (builder) => {
    
    builder
      .addCase(getAnalytics.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAnalytics.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.analytics = action.payload
      })
      .addCase(getAnalytics.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      }).addCase(getAnalyticsCharts.fulfilled, (state, action) => {
        state.analyticsCharts = action.payload;
      });
      
  }
})
export const { reset } = analyticsSlice.actions
export default analyticsSlice.reducer
export const { reducer: agentAnalyticsReducer } = AgentAnalyticsSlice;
export const { actions: agentAnalyticsActions } = AgentAnalyticsSlice;

export const { reducer: analyticsReducer } = analyticsSlice;
export const { actions: analyticsActions } = analyticsSlice;