import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import brandingService from './brandingService';

export const getBranding = createAsyncThunk('branding/getBranding', async () => {
    const response = await brandingService.getBranding();
    return response;
});

export const createBranding = createAsyncThunk('branding/createBranding', async (brandingData) => {
    const response = await brandingService.createBranding(brandingData);
    return response;
});


export const editBranding = createAsyncThunk('branding/editBranding', async (brandingData) => {
    const response = await brandingService.editBranding(brandingData);
    return response;
});
export const deleteBranding = createAsyncThunk('branding/deleteBranding', async (brandingData) => {
    const response = await brandingService.deleteBranding(brandingData);
    return response;
});
export const getActiveBranding = createAsyncThunk('branding/getActiveBranding', async () => {
    const response = await brandingService.getActiveBranding();
    console.log("response: ", response);
    return response;
});

const brandingSlice = createSlice({
    name: 'branding',
    initialState: {
        name: 'branding',
    initialState: {
        active: false,
        name: '',
        logo: null,
        color_ballet: [],
        banner: null,
    }
    },
    reducers: {
        setBranding: (state, action) => {
            state.branding = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getBranding.fulfilled, (state, action) => {
                state.branding = action.payload;
            })
            .addCase(createBranding.fulfilled, (state, action) => {
                state.branding = action.payload;
            })
            .addCase(editBranding.fulfilled, (state, action) => {
                state.branding = action.payload;
            })
            .addCase(getActiveBranding.fulfilled, (state, action) => {
                state.activeBranding = action.payload;
            });
    },
});

export const { setBranding } = brandingSlice.actions;

export default brandingSlice.reducer;