import React from 'react'
import Spinner from '../components/Spinner';
import {useState , useEffect} from 'react'
import {useSelector , useDispatch} from 'react-redux'
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify'
import { resetPassword , reset } from '../features/client/clientSlice';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {

    const [formData , setFormData] = useState({
        password: '',
        confirmPassword:'',
    })
    const {id , token} = useParams()

    const {password , confirmPassword} = formData;
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
        axios.post(`http://localhost:5000/api/users/resetPassword/${id}/${token}` , {password , confirmPassword})
        .then(res => {
            if(res.data.status === 200)
                alert("done")
          })
          .catch(error => {
            alert(error)
            console.error('AxiosError:', error);
          });
    }

    if(isLoading)   
        return <Spinner />
        
  return (
    <>
    <section className="heading">
      <p>Enter your new password</p>
  </section>
 <section className="form">
  <form onSubmit={onSubmit}>
      <div className="form-group">
          <label htmlFor="text">New password</label>
          <input type="password" className="form-control" id='password' name='password' value={password} placeholder='' onChange={onChange}/>
          <label htmlFor="text">confirm Password</label>
          <input type="password" className="form-control" id='confirmPassword' name='confirmPassword' value={confirmPassword} placeholder='' onChange={onChange}/>
      </div>
      <div className="form-group">
          <button type='submit' className='btn btn-bloc'>update</button>
      </div>
  </form>
 </section>
  </>
  )
}

export default ResetPassword
