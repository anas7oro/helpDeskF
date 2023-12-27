import axios from "axios";
const API_URL = "http://localhost:3000/api/";

const getKnowledge = async () => {
    try {
        console.log("trying to get knowledge in server");
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const res = await axios.get(`${API_URL}users/getKnowledgeBase`, config);
        console.log("res: ", res);  
        if (!res.data || res.data.error) { 
            throw new Error('Unexpected response from the server');
        }
        console.log("res.data: ", res.data);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error; 
    }
}
const getKnowledgeById = async (id) => {
    try {
        console.log("trying to get knowledge in server");
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const res = await axios.get(`${API_URL}users/knowledge/${id}`, config);
        if (!res.data || res.data.error) { 
            throw new Error('Unexpected response from the server');
        }
        console.log("res.data: ", res.data);
        return res.data;
    } catch (error) {
        console.log(error);
        throw error; 
    }
}
const createKnowledge = async (form) => {
    try {
        console.log("trying to create knowledge in server");
        console.log("form: ", form);
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const res = await axios.post(`${API_URL}agent/createKnowledge`, form, config);
        if (!res.data || res.data.error) { 
            throw new Error('Unexpected response from the server');
        }
        return res.data;
    } catch (error) {
        console.log(error);
        throw error; 
    }
}
const knowledgeService = {
    getKnowledge,
    getKnowledgeById,
    createKnowledge
};
export default knowledgeService;