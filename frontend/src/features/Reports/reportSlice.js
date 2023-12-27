import {createSlice , createAsyncThunk} from '@reduxjs/toolkit'
import reportService from './reportService'

const initialState = {
    reports:[],
    tickets:[],
    isLoading:false,
    isError:false,
    isSuccess:false,
    message:''
}
export const getReports = createAsyncThunk('reports/getReports', async ( thunkAPI) => {
    try {
        console.log("trying to get reports in slice");
        const data = await reportService.getReports();
        console.log("Reports from slice: ", data);
        return data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});
export const getReport = createAsyncThunk('reports/getReport', async (selectedTicketId, thunkAPI) => {
    try {
        const data = await reportService.getReport(selectedTicketId);
        console.log("Reports from slice: ", data.title);
        return data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});
export const editReport = createAsyncThunk('reports/editReport', async (form, thunkAPI) => {
    try {
        console.log("trying to edit report in slice");
        console.log("form: ", form);
        const data = await reportService.editReport(form);
        console.log("Reports from slice: ", data);
        return data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const getTickets = createAsyncThunk('reports/getTickets', async (form, thunkAPI) => {
    try {
        console.log("trying to get tickets ");
        const data = await reportService.getTickets(form);
        console.log("Tickets from slice: ", data);
        return data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});
export const createReport = createAsyncThunk('reports/createReport', async (form, thunkAPI) => {
    try {
        console.log("trying to create report in slice");
        console.log("form: ", form);
        const data = await reportService.createReport(form);
        console.log("Reports from slice: ", data);
        return data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});
const ticketsSlice = createSlice({
    name:'tickets',
    initialState: { tickets: [], status: 'pending', agentEmail: '', agentId: '' },
    reducers:{
        setStatus: (state, action) => {
            state.status = action.payload;
        },
        setAgentEmail: (state, action) => {
            state.agentEmail = action.payload;
        },
        setAgentId: (state, action) => {
            state.agentId = action.payload;
        },
    },
    extraReducers:(builder)=>{
        builder.addCase(getTickets.fulfilled, (state, action)=>{
            state.tickets = action.payload;
        })
    }
})
export const reportSlice = createSlice({
    name:'reports',
    initialState: { reports: [] },
    initialState,
    reducers:{
        getReports: (state, action) => {
            state.reports = action.payload;
          },
        reset:(state)=>{
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = ''
        }
    },
    extraReducers:(builder)=>{
        builder
            .addCase(getReports.pending, (state)=>{
                state.isLoading = true
                state.isError = false
                state.isSuccess = false
                state.message = ''
            })
            .addCase(getReports.fulfilled, (state, action)=>{
                state.isLoading = false
                state.isError = false
                state.isSuccess = true
                state.message = ''
                state.reports = action.payload
            })
    }
})
export const {reset} = reportSlice.actions
export default reportSlice.reducer

export const { reducer: reportReducer } = reportSlice;
export const { actions: reportActions } = reportSlice;

export const { setStatus, setAgentEmail, setAgentId } = ticketsSlice.actions;
export const { reducer: ticketsReducer } = ticketsSlice;
export const { actions: ticketsActions } = ticketsSlice;

