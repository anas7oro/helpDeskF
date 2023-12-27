import React from 'react'
import {useState , useEffect} from 'react'
import {useSelector , useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify'
import { forgotPassword , reset } from '../features/client/clientSlice';
import Spinner from '../components/Spinner';


function ForgotPassword() {
    const [formData , setFormData] = useState({
        email:'',
    })

    const { email  } = formData;

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {user , isLoading , isError ,isSuccess , message} = useSelector((state)=>state.client)

    useEffect(()=>{
        if(isError)
            toast.error(message)
        if(isSuccess)
            toast.info(message)

        dispatch(reset())

    },[user , isError , isSuccess , message , navigate , dispatch])


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
        }

        dispatch(forgotPassword(userData))
    }

    if(isLoading)
        return <Spinner />

  return (
    <>
    <section className="heading">
        <h1>Reset Password</h1>
        <p>enter your email to reset your password</p>
    </section>
    <section className="form">
        <form onSubmit={onSubmit}>
            <div className="form-group">
            <input type="email" className="form-control" id='email' name='email' value={email} placeholder='email' onChange={onChange}/>
            </div>
            <div className="form-group">
                <button type='submit' className='btn btn-bloc'>submit</button>
            </div>         
        </form>
    </section>
    </>
  )
}

export default ForgotPassword
