import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUserData, mfa ,reset } from "../features/client/clientSlice";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import {toast} from 'react-toastify'


function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.client.userData);
  const { token, email } = useSelector((state) => state.auth.user);
  useEffect(() => {
    dispatch(getUserData({ token, email }));
  }, [token, email, dispatch]);

  
  const {user , isLoading , isError ,isSuccess , message} = useSelector((state)=>state.client)
    
  useEffect(()=>{
      if(isError)
          toast.error(message)
      if(isSuccess)
          toast.info(message)
         

      dispatch(reset())

  },[user , isError , isSuccess , message , navigate , dispatch])

  const handleUpdateDataClick = () => {
    navigate("/updateData");
  };

  const handleUpdatePasswordClick = () => {
    navigate("/updatePassword");
  };

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(mfa());
  };

  return (
    <>
    <Header />
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Welcome to your profile</h1>
      {userData && (
        <div style={{ marginBottom: "20px" }}>
          <h2>{userData.name}</h2>
          <p>Email: {userData.email}</p>
          <p>
            Date of Birth: {new Date(userData.dateOfBirth).toLocaleDateString()}
          </p>
          <p>Address: {userData.address}</p>
          <p>MFA: {userData.MFA ? "Enabled" : "Disabled"}</p>
          <p>Phone Number: {userData.phoneNumber}</p>
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <button
          type="submit"
          className="btn btn-bloc"
          onClick={handleUpdateDataClick}
        >
          Update Data
        </button>
        <button
          type="submit"
          className="btn btn-bloc"
          onClick={handleUpdatePasswordClick}
        >
          Update Password
        </button>
      </div>
      <form onSubmit={onSubmit}>
      <button type="submit" className="btn btn-bloc">
  {userData && userData.MFA ? "Disable MFA" : "Enable MFA"}
</button>
      </form>
    </div>
    </>
  );
}

export default Profile;
