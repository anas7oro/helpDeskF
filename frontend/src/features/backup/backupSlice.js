import backupSeervice from './backupService';
import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    backups: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ''
}
export const getBackups  = createAsyncThunk('backups/getBackups', async ( thunkAPI) => {
    try {
        console.log("trying to get backups in slice");
        const data = await backupSeervice.getBackups();
        console.log("Backups from slice: ", data);
        return data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});
export const restoreBackup  = createAsyncThunk('backups/restoreBackup', async (backup, thunkAPI) => {
    try {
        console.log("trying to restore backup in slice");
        const data = await backupSeervice.restoreBackup(backup);
        console.log("Backup from slice: ", data);
        return data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});
export const restoreLatestBackup  = createAsyncThunk('backups/restoreLatestBackup', async ( thunkAPI) => {
    try {
        console.log("trying to restore latest backup in slice");
        const data = await backupSeervice.restoreLatestBackup();
        console.log("Backup from slice: ", data);
        return data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});
export const createBackup  = createAsyncThunk('backups/createBackup', async ( thunkAPI) => {
    try {
        console.log("trying to create backup in slice");
        const data = await backupSeervice.createBackup();
        console.log("Backup from slice: ", data);
        return data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

const backupsSlice = createSlice({
    name: 'backups',
    initialState,
    reducers: {
        clearState: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = '';
        },isError: (state, action) => {
            state.isError = action.payload;
          },
          isSuccess: (state, action) => {
            state.isSuccess = action.payload;
          },
          message: (state, action) => {
            state.message = action.payload;
          }
    },
    extraReducers: {
        [getBackups.pending]: (state) => {
            state.isLoading = true;
        },
        [getBackups.fulfilled]: (state, { payload }) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.backups = payload;
        },
        [getBackups.rejected]: (state, { payload }) => {
            state.isLoading = false;
            state.isError = true;
            state.message = payload;
        },
        [restoreBackup.pending]: (state) => {
            state.isLoading = true;
        },
        [restoreBackup.fulfilled]: (state, { payload }) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.message = payload;
        },
        [restoreBackup.rejected]: (state, { payload }) => {
            state.isLoading = false;
            state.isError = true;
            state.message = payload;
        },
        [restoreLatestBackup.pending]: (state) => {
            state.isLoading = true;
        },
        [restoreLatestBackup.fulfilled]: (state, { payload }) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.message = payload;
        },
        [restoreLatestBackup.rejected]: (state, { payload }) => {
            state.isLoading = false;
            state.isError = true;
            state.message = payload;
        },
        [createBackup.pending]: (state) => {
            state.isLoading = true;
        },
        [createBackup.fulfilled]: (state, { payload }) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.message = payload;
        },
        [createBackup.rejected]: (state, { payload }) => {
            state.isLoading = false;
            state.isError = true;
            state.message = payload;
        }

    }
});
export const {  clearState } = backupsSlice.actions;
// export { getBackups, restoreBackup, restoreLatestBackup, createBackup };
export default backupsSlice.reducer;
export const {  isError, isSuccess, message } = backupsSlice.actions;
