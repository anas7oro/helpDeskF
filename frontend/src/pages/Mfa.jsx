import React from 'react'
import {useState , useEffect} from 'react'
import {useSelector , useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify'
import Spinner from '../components/Spinner';
import { otpVerification , reset } from '../features/auth/authSlice';

function Mfa() {

    const [formData , setFormData] = useState({
        OTP:'',
    })

    const { OTP } = formData;

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {user , isLoading , isError ,isSuccess , message} = useSelector((state)=>state.auth)

    useEffect(()=>{
        if(isError)
            toast.error(message)
        if(isSuccess)
            navigate('/profile')

        dispatch(reset())

    },[user , isError , isSuccess , message , navigate , dispatch])
    const email = user.email;


    const onChange= (e)=>{
        setFormData((prevState)=>({
            ...prevState,
            [e.target.name]:e.target.value,
        }))
    }
    const onSubmit= (e)=>{
        e.preventDefault();

        const userData = {
            OTP,
            email
        }
        

        dispatch(otpVerification(userData))
    }

    if(isLoading)
        return <Spinner />

  return (
    <>
    <section className="heading">
        <p>OTP has been sent tou your email</p>
    </section>
    <section className="form">
        <form onSubmit={onSubmit}>
            <div className="form-group">
            <label htmlFor="text">your OTP </label>
            <input type="text" className="form-control" id='OTP' name='OTP' value={OTP} placeholder='OTP' onChange={onChange}/>
            </div>
            <div className="form-group">
                <button type='submit' className='btn btn-bloc'>submit</button>
            </div>         
        </form>
    </section>
    </>
  )
}

export default Mfa