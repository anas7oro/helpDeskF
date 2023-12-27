import React from 'react'
import {useState , useEffect} from 'react'
import {useSelector , useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify'
import { createUser , reset } from '../features/admin/adminSlice';
import Spinner from '../components/Spinner';
import Header from "../components/Header";

function CreateUser() {
    const [formData , setFormData] = useState({
        name: '',
        email:'',
        password:'',
        dateOfBirth:'',
        address:'',
        phoneNumber:'',
        role:''

    })
    const {name , email , password ,dateOfBirth , address , phoneNumber , role} = formData;
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {user , isLoading , isError ,isSuccess , message} = useSelector((state)=>state.admin)
    
    useEffect(()=>{
        console.log(message)
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

        const userData = {name , email , password ,dateOfBirth , address , phoneNumber , role};
        dispatch(createUser(userData))
    }

    if(isLoading)   
        return <Spinner />

        
  return (
    
    <>
    <Header />
      <section className="heading">
            <h1>create new user</h1>
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
                <input type="text" className="form-control" id='role' name='role' value={role} placeholder='role' onChange={onChange}/>
                </div>
                <div className="form-group">
                    <button type='submit' className='btn btn-bloc'>Submit</button>
                </div>
            </form>
        </section>
    </>
  )
}

export default CreateUser
