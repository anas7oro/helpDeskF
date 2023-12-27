import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Header from "../components/Header";

function Dashboard() {
  const navigate = useNavigate();
  const color_ballet = useSelector((state) => state.branding.activeBranding && state.branding.activeBranding.color_ballet);

  const handleLogsRedirect = () => {
    navigate("/logs");
  };
  const handleBackupsRedirect = () => {
    navigate("/backups");
  };
  const handleCreateUserClick = () => {
    navigate("/createUser");
  };
  const handleAssignRoleClick = () => {
    navigate("/assignRole");
  };
  const handleBranding = () => {
    navigate("/branding");
  }

  return (
    <div className="admin-dashboard">
      <Header />
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogsRedirect} style={{ backgroundColor: color_ballet ? color_ballet[0] : 'defaultColor', color: '#fff' }}>Go to Logs</button>
      <button onClick={handleBackupsRedirect} style={{ backgroundColor: color_ballet ? color_ballet[1] : 'defaultColor', color: '#fff' }}>Go to Backups</button>

      <button
        type="submit"
        className="btn btn-bloc"
        onClick={handleCreateUserClick}
        style={{ backgroundColor: color_ballet ? color_ballet[2] : 'defaultColor', color: '#fff' }}
      >
        create user
      </button>
      <button
        type="submit"
        className="btn btn-bloc"
        onClick={handleAssignRoleClick}
        style={{ backgroundColor: color_ballet ? color_ballet[0] : 'defaultColor', color: '#fff' }}
      >
        assign role
      </button>
      <button
        type="submit"
        className="btn btn-bloc"
        onClick={handleBranding}
        style={{ backgroundColor: color_ballet ? color_ballet[1] : 'defaultColor', color: '#fff' }}
      >
        branding
      </button>

    </div>
  );
}

export default Dashboard;