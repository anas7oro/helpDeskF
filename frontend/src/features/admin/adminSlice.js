import { createSlice ,createAsyncThunk } from "@reduxjs/toolkit";
import adminService from "./adminService";
const user = JSON.parse(localStorage.getItem('user'))



const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}


export const createUser = createAsyncThunk('admin/createUser', async(userData , thunkAPI)=>{
    try {
     const token = thunkAPI.getState().auth.user.token
      return await adminService.createUser(userData , token)
    } catch (error) {
     const message = (error.response && error.respone.data && error.respone.data.message) || error.message || error.toString()
     return thunkAPI.rejectWithValue(message)
    }
 })

 export const assignRole = createAsyncThunk('admin/assignRole', async(userData , thunkAPI)=>{
    try {
     const token = thunkAPI.getState().auth.user.token
      return await adminService.assignRole(userData , token)
    } catch (error) {
     const message = (error.response && error.respone.data && error.respone.data.message) || error.message || error.toString()
     return thunkAPI.rejectWithValue(message)
    }
 })







 export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers:{
        reset:(state)=>{
            state.isLoading = false
            state.isError  = false
            state.isSuccess = false
            state.message = ''
        }
    },
    extraReducers: (builder) =>{
        builder
            .addCase(createUser.pending , (state) =>{
                state.isLoading = true
            })
            .addCase(createUser.fulfilled , (state ,action)=>{
                state.isLoading = false
                state.isSuccess = true
                state.message = action.payload
            })
            .addCase(createUser.rejected , (state , action) =>{
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(assignRole.pending , (state) =>{
                state.isLoading = true
            })
            .addCase(assignRole.fulfilled , (state ,action)=>{
                state.isLoading = false
                state.isSuccess = true
                state.message = action.payload
            })
            .addCase(assignRole.rejected , (state , action) =>{
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
                    
        
        }

    })


export const {reset} = adminSlice.actions
export default adminSlice.reducer