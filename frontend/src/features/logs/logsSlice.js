import logsService from "./logsService";
import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    logs: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ''
}
export const getLogs  = createAsyncThunk('logs/getErrors', async ( thunkAPI) => {
    try {
        console.log("trying to get logs in slice");
        const data = await logsService.getErrors();
        console.log("Logs from slice: ", data);
        return data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

const logsSlice = createSlice({
    name: 'logs',
    initialState,
    reducers: {
       
        clearState: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = '';
        }
    },
    extraReducers: {
        [getLogs.pending]: (state) => {
            state.isLoading = true;
        },
        [getLogs.fulfilled]: (state, { payload }) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.logs = payload;
        },
        [getLogs.rejected]: (state, { payload }) => {
            state.isLoading = false;
            state.isError = true;
            state.message = payload;
        }
    }
});
export const {  clearState } = logsSlice.actions;
export default logsSlice.reducer;
