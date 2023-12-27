import axios from 'axios';

const API_URL = "http://localhost:3000/api/frontend/";

const getBranding = async () => {
    try {
        console.log("trying to get branding in server");
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const res = await axios.get(`${API_URL}getBranding`, config);
        console.log("res: ", res);  
        if (!res.data || res.data.error) { 
            throw new Error('Unexpected response from the server');
        }
        console.log("res.data: ", res.data);
        return res.data;
    } catch (error) {
        console.error('Failed to get branding:', error);
        throw error;
    }
};

const createBranding = async (brandingData) => {
    try {
        console.log("trying to create branding in server");
        console.log("brandingData: ", brandingData);
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const res = await axios.post(`${API_URL}createBranding`, brandingData, config);
        if (!res.data || res.data.error) { 
            throw new Error('Unexpected response from the server');
        }
        console.log("res.data: ", res.data);
        return res.data;
    } catch (error) {
        console.error('Failed to create branding:', error);
        throw error;
    }
};
const editBranding= async (brandingData) => {
    try {
        console.log("trying to edit branding in server");
        console.log("brandingData: ", brandingData);
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const res = await axios.put(`${API_URL}editBranding`, brandingData, config);
        if (!res.data || res.data.error) { 
            throw new Error('Unexpected response from the server');
        }
        console.log("res.data: ", res.data);
        return res.data;
    } catch (error) {
        console.error('Failed to edit branding:', error);
        throw error;
    }
};
const deleteBranding = async (brandingId) => {
    try {
        console.log("trying to delete branding in server");
        console.log("brandingId: ", brandingId);
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        console.log("config: ", config);
        const res = await axios.delete(`${API_URL}deleteBranding/${brandingId}`, config);
        if (!res.data || res.data.error) { 
            throw new Error('Unexpected response from the server');
        }
        console.log("res.data: ", res.data);
        return res.data;
    } catch (error) {
        console.error('Failed to delete branding:', error);
        throw error;
    }
}
const getActiveBranding = async () => {
    try {
        console.log("trying to get active branding in server");

        const res = await axios.get(`${API_URL}getActiveBranding`);
        console.log("res: ", res);  
        if (!res.data || res.data.error) { 
            throw new Error('Unexpected response from the server');
        }
        console.log("res.data: ", res.data);
        return res.data;
    } catch (error) {
        console.error('Failed to get active branding:', error);
        throw error;
    }
}

export default {
    getBranding,
    createBranding,
    editBranding,
    deleteBranding,
    getActiveBranding
};