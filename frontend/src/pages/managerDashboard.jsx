import Header from "../components/Header";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import WorkflowsForm from "../components/workflowsForm";
const ManagerDashboard = () => {
  const navigate = useNavigate();
  const {user} = useSelector((state) => state.auth);
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }

  }, [user,navigate]);
  

  const handleViewAnalytics = () => {
    navigate("/viewAnalytics");
  };
  const handleViewReports = () => {
    navigate("/manageReports");
  }

  return (
    <>
    <Header>
      <button className="btn" style={{ marginRight: '10px' }} onClick={handleViewAnalytics}>
        view analytics
      </button>
      <button className="btn" onClick={handleViewReports}>
        Manage Reports
      </button>
    </Header>     
    <section className="heading">      
      <h1 className="heading__title">Welcome {user&&user.name}</h1>
      <p className="heading__subtitle">Manager Dashboard</p>
    </section>
    <div className="container">    
    </div>
    <WorkflowsForm />
    </>
  );
};

export default ManagerDashboard;
