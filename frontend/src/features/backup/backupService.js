import axios from "axios";
const API_URL = "http://localhost:3000/api/admin";

const getBackups = async () => {
    try {
        console.log("trying to get backups in server");
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const res = await axios.get(`${API_URL}/getBackups`, config);
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
const restoreBackup = async (backup) => {
    try {
        console.log("backup: ", backup);
        console.log("trying to restore backup in server");
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const res = await axios.post(`${API_URL}/restoreBackup`, backup, config);
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
const restoreLatestBackup = async () => {
    try {
        console.log("trying to restore latest backup in server");
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const res = await axios.post(`${API_URL}/restoreLatestBackup`, {}, config);
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
const createBackup = async () => {
    try {
        console.log("trying to create backup in server");
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const res = await axios.post(`${API_URL}/createBackup`, {}, config);
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


const logsService = {
    getBackups,
    restoreBackup,
    restoreLatestBackup,
    createBackup
};
export default logsService;