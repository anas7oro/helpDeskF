import axios from "axios";


const API_URL ='/api/admin/'



const createUser = async(userData , token) =>{
    const config = {
        headers:{
            Authorization:`Bearer ${token}`
        }
    }
    const response = await axios.post(API_URL + 'createUser', userData , config)

    return response.data
}


const assignRole = async(userData , token) =>{
    const config = {
        headers:{
            Authorization:`Bearer ${token}`
        }
    }
    const response = await axios.post(API_URL + 'assignRole', userData , config)

    return response.data
}




const adminService ={
    createUser,
    assignRole
}


export default adminService 