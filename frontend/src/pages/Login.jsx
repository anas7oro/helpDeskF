import React from 'react'
import {useState , useEffect} from 'react'
import { FaSignInAlt } from 'react-icons/fa';
import {useSelector , useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify'
import { login , reset } from '../features/auth/authSlice';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import{getActiveBranding} from '../features/branding/brandingSlice'
function Login() {
    const [formData , setFormData] = useState({
        email:'',
        password:'',
   

    })
    const { email , password} = formData;

    const navigate = useNavigate()
    const dispatch = useDispatch()    
    const {user , isLoading , isError ,isSuccess , message} = useSelector((state)=>state.auth)
    

    useEffect(()=>{
        dispatch(getActiveBranding());
        if(isError)
            toast.error(message)
        if (isSuccess) {
            console.log("message.message",message);
            if(message.message){
                navigate('/otpVerification');
            }else{
                console.log("trying to get to the dashboard",message);
                toast.success(`welcome ${user.name}`)
                navigate('/dashboard')
            }
        }                       
        
        dispatch(reset())

    },[user , isError , isSuccess , message , navigate , dispatch])

    const color_ballet = useSelector((state) => state.branding.activeBranding && state.branding.activeBranding.color_ballet);
    console.log("color_ballet",color_ballet);

    const onChange= (e)=>{
        setFormData((prevState)=>({
            ...prevState,
            [e.target.name]:e.target.value,
        }))
    }
    const onSubmit= (e)=>{
        e.preventDefault();
        
        const userData = {
            email,
            password
        }

        dispatch(login(userData))
    }

    if(isLoading)
        return <Spinner />
    

    

    return (
        <>
        <section className="heading" style={{ color: color_ballet ? color_ballet[0] : 'defaultColor' }}>
            <h1><FaSignInAlt /> Login</h1>
            <p>here you can login to our website</p>
        </section>
        <section className="form">
            <form onSubmit={onSubmit}>
                <div className="form-group">
                <input type="email" className="form-control" id='email' name='email' value={email} placeholder='email' onChange={onChange} style={{ borderColor: color_ballet ? color_ballet[1] : 'defaultColor' }}/>
                <input type="password" className="form-control" id='password' name='password' value={password} placeholder='password' onChange={onChange} style={{ borderColor: color_ballet ? color_ballet[1] : 'defaultColor' }}/>
                </div>
                <div className="form-group">
                    <button type='submit' className='btn btn-bloc' style={{ backgroundColor: color_ballet ? color_ballet[2] : 'defaultColor', color: '#fff' }}>Login</button>
                </div>
                <div className="form-group">
            <p>
              <Link to="/forgotPassword" style={{ color: color_ballet ? color_ballet[0] : 'defaultColor' }}>Forgot Password?</Link>
            </p>
            </div>

            </form>
        </section>
        </>
    )
}

export default Login