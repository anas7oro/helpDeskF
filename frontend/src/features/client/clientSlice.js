import { createSlice ,createAsyncThunk } from "@reduxjs/toolkit";
import clientService from "./clientService";
const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
    userData: null
}


export const updateData = createAsyncThunk('client/updateData', async(userData , thunkAPI)=>{
   try {
    const token = thunkAPI.getState().auth.user.token
     return await clientService.updateData(userData , token)
   } catch (error) {
    const message = (error.response && error.respone.data && error.respone.data.message) || error.message || error.toString()
    return thunkAPI.rejectWithValue(message)
   }
})
// Define the async thunk with a single argument
export const getUserData = createAsyncThunk('client/getUserData', async ({ token, email }, thunkAPI) => {
    try {
      console.log("email from thunk : " + email + " token : " + token);
      return await clientService.getUserData(email, token);
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  });

export const updatePassword = createAsyncThunk('client/updatePassword', async(userData , thunkAPI)=>{
    try {
      const token = thunkAPI.getState().auth.user.token
      return await clientService.updatePassword(userData , token)
    } catch (error) {
     const message = (error.response && error.respone.data && error.respone.data.message) || error.message || error.toString()
     return thunkAPI.rejectWithValue(message)
    }
 })

 export const forgotPassword = createAsyncThunk('client/forgotPassword', async(userData , thunkAPI)=>{
    try {
        return await clientService.forgotPassword(userData)
    } catch (error) {
        const message = (error.response && error.respone.data && error.respone.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const resetPassword = createAsyncThunk('client/resetPassword', async(userData , param , thunkAPI)=>{
    try {
        return await clientService.resetPassword(userData , param)
    } catch (error) {
        const message = (error.response && error.respone.data && error.respone.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})  

export const mfa = createAsyncThunk('client/mfa', async(userData , thunkAPI)=>{
    try {
      const token = thunkAPI.getState().auth.user.token
      return await clientService.mfa(userData , token)
    } catch (error) {
     const message = (error.response && error.respone.data && error.respone.data.message) || error.message || error.toString()
     return thunkAPI.rejectWithValue(message)
    }
 })




export const clientSlice = createSlice({
    name: 'client',
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
            .addCase(updateData.pending , (state) =>{
                state.isLoading = true
            })
            .addCase(updateData.fulfilled , (state ,action)=>{
                state.isLoading = false
                state.isSuccess = true
                state.message = action.payload
            })
            .addCase(updateData.rejected , (state , action) =>{
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(updatePassword.pending , (state) =>{
                state.isLoading = true
            })
            .addCase(updatePassword.fulfilled , (state ,action)=>{
                state.isLoading = false
                state.isSuccess = true
                state.message = action.payload
            })
            .addCase(updatePassword.rejected , (state , action) =>{
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(forgotPassword.pending , (state) =>{
                state.isLoading = true
            })
            .addCase(forgotPassword.fulfilled , (state ,action)=>{
                state.isLoading = false
                state.isSuccess = true
                state.message = action.payload
            })
            .addCase(forgotPassword.rejected , (state , action) =>{
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(resetPassword.pending , (state) =>{
                state.isLoading = true
            })
            .addCase(resetPassword.fulfilled , (state ,action)=>{
                state.isLoading = false
                state.isSuccess = true
                state.message = action.payload
            })
            .addCase(resetPassword.rejected , (state , action) =>{
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(mfa.pending , (state) =>{
                state.isLoading = true
            })
            .addCase(mfa.fulfilled , (state ,action)=>{
                state.isLoading = false
                state.isSuccess = true
                state.message = action.payload
            })
            .addCase(mfa.rejected , (state , action) =>{
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.user = null
            })
            .addCase(getUserData.fulfilled , (state ,action)=>{
                state.userData = action.payload
            })
          
        
        
        
        }

})

export const {reset} = clientSlice.actions
export default clientSlice.reducer