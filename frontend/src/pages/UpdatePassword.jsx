import React from 'react'
import Spinner from '../components/Spinner';
import {useState , useEffect} from 'react'
import {useSelector , useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify'
import { updatePassword , reset } from '../features/client/clientSlice';
import Header from "../components/Header";


function UpdatePassword() {
    const [formData , setFormData] = useState({
        password: '',
        newPassword:'',
        confirmNew:'',
    })
    const {password , newPassword , confirmNew } = formData;
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

        const userData = {password , newPassword ,confirmNew};
        dispatch(updatePassword(userData))
    }

    if(isLoading)   
        return <Spinner />
        
  return (
    <>
    <Header />
      <section className="heading">
        <p>here you can update your Password</p>
    </section>
   <section className="form">
    <form onSubmit={onSubmit}>
        <div className="form-group">
            <label htmlFor="text">old Password</label>
            <input type="password" className="form-control" id='password' name='password' value={password} placeholder='' onChange={onChange}/>
            <label htmlFor="text">New Password</label>
            <input type="password" className="form-control" id='newPassword' name='newPassword' value={newPassword} placeholder='' onChange={onChange}/>
            <label htmlFor="text">confirm Password</label>
            <input type="password" className="form-control" id='confirmNew' name='confirmNew' value={confirmNew} placeholder='' onChange={onChange}/>
        </div>
        <div className="form-group">
            <button type='submit' className='btn btn-bloc'>update</button>
        </div>
    </form>
   </section>
    </>
  )
}

export default UpdatePassword
