import React from 'react'
import Spinner from '../components/Spinner';
import {useState , useEffect} from 'react'
import {useSelector , useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify'
import { updateData , reset } from '../features/client/clientSlice';
import Header from "../components/Header";


function UpdateData() {
    const [formData , setFormData] = useState({
        name: '',
        email:'',
        dateOfBirth:'',
        address:'',
        phoneNumber:''

    })
    const {name , email , dateOfBirth , address , phoneNumber} = formData;
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

        const userData = {name , email ,dateOfBirth , address , phoneNumber};
        dispatch(updateData(userData))
    }

    if(isLoading)   
        return <Spinner />

  return (
   <>
   <Header />
    <section className="heading">
        <p>here you can update your data</p>
    </section>
   <section className="form">
    <form onSubmit={onSubmit}>
        <div className="form-group">
            <label htmlFor="text">address</label>
            <input type="text" className="form-control" id='address' name='address' value={address} placeholder='address' onChange={onChange}/>
            <label htmlFor="text">email</label>
            <input type="email" className="form-control" id='email' name='email' value={email} placeholder='email' onChange={onChange}/>
            <label htmlFor="text">dateOfBirth</label>
            <input type="text" className="form-control" id='dateOfBirth' name='dateOfBirth' value={dateOfBirth} placeholder='dateOfBirth' onChange={onChange}/>
            <label htmlFor="text">name</label>
            <input type="text" className="form-control" id='name' name='name' value={name} placeholder='name' onChange={onChange}/>
            <label htmlFor="text">phoneNumber</label>
            <input type="text" className="form-control" id='phoneNumber' name='phoneNumber' value={phoneNumber} placeholder='phoneNumber' onChange={onChange}/>
        </div>
        <div className="form-group">
            <button type='submit' className='btn btn-bloc'>update</button>
        </div>
    </form>
   </section>
   </>
  )
}

export default UpdateData
