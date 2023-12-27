import axios from "axios";
const API_URL = "http://localhost:3000/api/manager";

const createWorkflow = async (data, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    try {
        const res = await axios.post(`${API_URL}/createWorkflow`, data, config);

        if (!res.data || res.data.error) { 
            throw new Error('Unexpected response from the server');
        }

        return res.data;
    } catch (error) {
        console.log(error);
        throw error; 
    }
};
const getWorkflows = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    try {
        const res = await axios.get(`${API_URL}/getWorkflow`, config);

        if (!res.data || res.data.error) { 
            throw new Error('Unexpected response from the server');
        }

        return res.data;
    } catch (error) {
        console.log(error);
        throw error; 
    }
};
//edit workflows
const editWorkflow = async (id, data, token) => {

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    try {
        const res = await axios.put(`${API_URL}/updateWorkflow/${id}`, data, config);

        if (!res.data || res.data.error) { 
            throw new Error('Unexpected response from the server');
        }

        return res.data;
    } catch (error) {
        console.log(error);
        throw error; 
    }
};
    

const workflowsService = {
    createWorkflow,
    getWorkflows,
    editWorkflow,
}

export default workflowsService;
