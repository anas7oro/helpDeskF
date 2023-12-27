import {createSlice , createAsyncThunk} from '@reduxjs/toolkit'
import workflowsService from './workflowsService'
const user = JSON.parse(localStorage.getItem('user'))

const initialState ={
    user: user ? user : null,
    isError: false,
    workflows: [],
    isSuccess: false,
    isLoading: false,
    message: ''
}

const createWorkflow = createAsyncThunk('workflows/createWorkflow',
     async (data,{rejectWithValue})=>{
        try{
            const token = JSON.parse(localStorage.getItem('user')).token
            return await workflowsService.createWorkflow(data,token)   
        }catch(error){
            return rejectWithValue(error)
        }
    }
)

const getWorkflows = createAsyncThunk('workflows/getWorkflows',
    async (_,{rejectWithValue})=>{
        try{
            const token = JSON.parse(localStorage.getItem('user')).token
            return await workflowsService.getWorkflows(token)   
        }catch(error){
            return rejectWithValue(error)
        }
    }
)

const editWorkflow = createAsyncThunk('workflows/editWorkflow',
    async ({id, data}, {rejectWithValue}) => {
        try {
            const token = JSON.parse(localStorage.getItem('user')).token
            return await workflowsService.editWorkflow(id, data, token)   
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const workFlowSlice = createSlice({
    name: 'workflows',
    initialState,
    reducers: {
        reset:(state)=>{
            state.isLoading = false
            state.isError  = false
            state.isSuccess = false
            state.message = ''
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(createWorkflow.pending,(state)=>{
            state.isLoading = true
        }).addCase(createWorkflow.fulfilled,(state,{payload})=>{
            state.isLoading = false
            state.isSuccess = true
            state.message = payload.message
        },).addCase(createWorkflow.rejected,(state,{payload})=>{
            state.isLoading = false
            state.isError = true
            state.message = payload.message
        }).addCase(getWorkflows.fulfilled, (state, action) => {
            state.workflows = action.payload;
            state.isLoading = false;
          })
    },
})

export const {reset} = workFlowSlice.actions
export default workFlowSlice.reducer
export {createWorkflow, editWorkflow, getWorkflows}