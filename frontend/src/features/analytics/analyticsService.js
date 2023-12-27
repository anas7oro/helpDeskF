
import axios from "axios";
const API_URL = "http://localhost:3000/api/manager";

const getAnalytics = async (form) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user.token;
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            ...form
        }
    };
    try {
        const res = await axios.get(`${API_URL}/getAnalytics`, config);
        if (!res.data || res.data.error) { 
            throw new Error('Unexpected response from the server');
        }
        return res.data;
    } catch (error) {
        console.log(error);
        throw error; 
    }
}
const getAgentAnalytics = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user.token;
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    try {
        console.log("getting Agent analytics  from server");
        const res = await axios.get(`${API_URL}/getAgentsAnalytics`, config);
        console.log("res from getAgentAnalytics server",res);
        if (!res.data || res.data.error) { 
            throw new Error('Unexpected response from the server');
        }
        return res.data;
    } catch (error) {
        console.log(error);
        throw error; 
    }
}
const getAnalyticsCharts = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user.token;
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    try {
        const res = await axios.get(`${API_URL}/getAnalyticsCharts`, config);
        if (!res.data || res.data.error) { 
            throw new Error('Unexpected response from the server');
        }
        console.log("res from getAnalyticsCharts server",res);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error; 
    }
}



const analyticsService = {
    getAnalytics,
    getAgentAnalytics,
    getAnalyticsCharts
}
export default analyticsService;