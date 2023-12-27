import axios from "axios";


const API_URL ='/api/users/'
const updateData = async(userData , token) =>{
    const config = {
        headers:{
            Authorization:`Bearer ${token}`
        }
    }
    const response = await axios.post(API_URL + 'updateData', userData , config)

    return response.data
}

const updatePassword = async(userData , token) =>{
    const config = {
        headers:{
            Authorization:`Bearer ${token}`
        }
    }
    const response = await axios.post(API_URL + 'updatePassword', userData , config)

    return response.data
}

const forgotPassword = async(userData) =>{
    const response = await axios.post(API_URL + 'forgotPassword' , userData)
    return response.data
}

const resetPassword = async(userData ) =>{

    const response = await axios.post(API_URL + `resetPassword/6582a333e37f5e067dd421dc/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ODJhMzMzZTM3ZjVlMDY3ZGQ0MjFkYyIsImVtYWlsIjoiYW5hcy5ob3JvODhAZ21haWwuY29tIiwiaWF0IjoxNzAzMDkwNjI1LCJleHAiOjE3MDMxNzcwMjV9.Odv0Ep1TW7QNiNDIuDWmdhK6_u3dZnHZ08_5qkzT32s` , userData)
    console.log("response from service : "+response);
    return response.data
}

const mfa = async(userData , token) =>{
    const config = {
        headers:{
            Authorization:`Bearer ${token}`
        }
    }
    const response = await axios.post(API_URL + 'mfa', userData , config)

    return response.data
}
const getUserData = async(email , token) => {
    console.log("email from service : " + email + " token : " + token)
    const config = {
        headers:{
            Authorization:`Bearer ${token}`
        }
    }
    const response = await axios.post(API_URL + 'getUserData', { email }, config)

    return response.data
}




const clientService ={
    updateData,
    updatePassword,
    forgotPassword,
    resetPassword,
    mfa,
    getUserData
   
}


export default clientService