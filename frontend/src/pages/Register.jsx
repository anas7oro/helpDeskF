import React from 'react'
import {useState , useEffect} from 'react'
import {useSelector , useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify'
import { FaUserAlt } from 'react-icons/fa';
import { register , reset } from '../features/auth/authSlice';
import Spinner from '../components/Spinner';

function Register() {
    const [formData , setFormData] = useState({
        name: '',
        email:'',
        password:'',
        dateOfBirth:'',
        address:'',
        phoneNumber:''

    })
    const {name , email , password ,dateOfBirth , address , phoneNumber} = formData;
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

        const userData = {name , email , password ,dateOfBirth , address , phoneNumber};
        dispatch(register(userData))
    }

    if(isLoading)   
        return <Spinner />

        
    return (
        <>
        <section className="heading">
            <h1><FaUserAlt /> register</h1>
            <p>here you can register in our website</p>
        </section>
        <section className="form">
            <form onSubmit={onSubmit}>
                <div className="form-group">
                <input type="text" className="form-control" id='name' name='name' value={name} placeholder='name' onChange={onChange}/>
                <input type="email" className="form-control" id='email' name='email' value={email} placeholder='email' onChange={onChange}/>
                <input type="password" className="form-control" id='password' name='password' value={password} placeholder='password' onChange={onChange}/>
                <input type="text" className="form-control" id='dateOfBirth' name='dateOfBirth' value={dateOfBirth} placeholder='dateOfBirth' onChange={onChange}/>
                <input type="text" className="form-control" id='address' name='address' value={address} placeholder='address' onChange={onChange}/>
                <input type="text" className="form-control" id='phoneNumber' name='phoneNumber' value={phoneNumber} placeholder='phoneNumber' onChange={onChange}/>
                </div>
                <div className="form-group">
                    <button type='submit' className='btn btn-bloc'>submit</button>
                </div>
            </form>
        </section>
        </>
    )
}

export default Register
