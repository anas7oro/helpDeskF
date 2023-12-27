import axios from "axios";
const API_URL = "http://localhost:3000/api/admin";

const getErrors = async () => {
    try {
        console.log("trying to get knowledge in server");
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const res = await axios.get(`${API_URL}/getErrorLogs`, config);
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
    getErrors,
   
};
export default logsService;