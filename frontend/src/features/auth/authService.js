import axios from 'axios'


const API_URL ='/api/users/'
const register = async(userData) =>{
    const response = await axios.post(API_URL + 'createUser', userData)

    if(response.data)
        localStorage.setItem('user' , JSON.stringify(response.data))
    
    return response.data
}

const login = async(userData) =>{
    const response = await axios.post(API_URL + 'login' , userData)

    if(response.data)
        localStorage.setItem('user' , JSON.stringify(response.data))
    
    return response.data
}

const otpVerification = async(userData) =>{
    const response = await axios.post(API_URL + 'otpVerification/:id' , userData)

    if(response.data)
        localStorage.setItem('user' , JSON.stringify(response.data))
    
    return response.data
}




const logout = () =>{
    localStorage.removeItem('user')
}

const authService= {
    register,
    logout,
    login,
    otpVerification
    
}


export default authService