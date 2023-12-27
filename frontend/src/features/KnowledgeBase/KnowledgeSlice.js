import server from './KnowledgeService';
import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    knowledge: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ''
}
export const getKnowledge  = createAsyncThunk('knowledge/getKnowledgeBase', async ( thunkAPI) => {
    try {
        console.log("trying to get knowledge in slice");
        const data = await server.getKnowledge();
        console.log("Knowledge from slice: ", data);
        return data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});
export const getKnowledgeById  = createAsyncThunk('knowledge/getKnowledgeById', async (id, thunkAPI) => {
    try {
        console.log("trying to get knowledge in slice");
        const data = await server.getKnowledgeById(id);
        console.log("Knowledge from slice: ", data);
        return data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});
export const createKnowledge  = createAsyncThunk('knowledge/createKnowledge', async (form, thunkAPI) => {
    try {
        console.log("trying to create knowledge in slice");
        console.log("form: ", form);
        const data = await server.createKnowledge(form);
        console.log("Knowledge from slice: ", data);
        return data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

const knowledgeSlice = createSlice({
    name: 'knowledge',
    initialState,
    reducers: {
        clearMessage: (state) => {
            state.message = '';
        },
        clearState: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = '';
        }
    },
    extraReducers: {
        [createKnowledge.pending]: (state) => {
            state.isLoading = true;
        },
        [createKnowledge.fulfilled]: (state, { payload }) => {
            state.knowledgeBase = payload;
            state.isLoading = false;
            state.isSuccess = true;
        },
        [createKnowledge.rejected]: (state, { payload }) => {
            state.isLoading = false;
            state.isError = true;
            state.message = payload;
        },
        [getKnowledge.pending]: (state) => {
            state.isLoading = true;
        },
        [getKnowledge.fulfilled]: (state, { payload }) => {
            state.knowledge = payload;
            state.isLoading = false;
            state.isSuccess = true;
        },
        [getKnowledge.rejected]: (state, { payload }) => {
            state.isLoading = false;
            state.isError = true;
            state.message = payload;
        }
    }
});
export const { reducer: knowledgeReducer } = knowledgeSlice;
export const { actions: knowledgeActions } = knowledgeSlice;
export default knowledgeSlice.reducer;